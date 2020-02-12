import _ from "lodash";
import { join } from "path";

import {
    NoBundleOrRedirectToError,
    NoMatchingEntrypointError
} from "../../common/functionalErrors";
import removePrefix from "../../common/removePrefix";
import StoragesInconsistencyError from "../../common/StoragesInconsistencyError";
import Usecase from "../../common/Usecase";
import { IConfiguration } from "../../entities/Configuration";
import { IEndpointRequest } from "../../entities/EndpointRequest";
import { IEndpointResponse } from "../../entities/EndpointResponse";
import { IEntrypoint } from "../../entities/Entrypoint";
import addTrailingSlash from "./addTrailingSlash";
import configureHtml from "./configureHtml";
import findMatchingAsset from "./findMatchingAsset";
import getConfigurationScript from "./getConfigurationScript";
import isCanonicalPath from "./isCanonicalPath";
import toAbsolute from "./toAbsolute";
import whitelistInlineScript from "./whitelistInlineScript";

type Arguments = [IEndpointRequest];
type ReturnValue = IEndpointResponse;

export default class RespondToEndpointRequest extends Usecase<
    Arguments,
    ReturnValue
> {
    protected async _exec(request: Arguments[0]): Promise<ReturnValue> {
        // Find the matching entrypoint
        const requestedUrl = join(request.hostname, request.path);
        const entrypoints = await this.storages.entrypoints.findManyByUrlMatcherHostname(
            request.hostname
        );
        const matchingEntrypoint = _(entrypoints)
            .filter(
                entrypoint =>
                    _.startsWith(requestedUrl, entrypoint.urlMatcher) ||
                    _.startsWith(
                        addTrailingSlash(requestedUrl),
                        entrypoint.urlMatcher
                    )
            )
            .sortBy("urlMatcher.length")
            .last();

        // On no matching entrypoint, throw a NoMatchingEntrypointError
        if (!matchingEntrypoint) {
            throw new NoMatchingEntrypointError(requestedUrl);
        }

        // Here we test if we're in the situation in which the url requested
        // equals one entrypoint's urlMatcher minus the trailing slash.
        //
        // Example:
        //   entrypoint.urlMatcher === "domain.com/path/"
        //   requestedUrl === "domain.com/path"
        //
        // In this situation other, shorter entrypoints might match the
        // requested url, for instance an entrypoint with urlMatcher
        // "domain.com/" in the example above.
        //
        // We have three possible ways to handle the request:
        //
        // 1. serve the shorter matching entrypoint if present, return a 301
        //    otherwise
        // 2. serve the shorter matching entrypoint if present, return a 301
        //    to the with-trailing-slash-matching entrypoint otherwise
        // 3. always return a 301 to the with-trailing-slash-matching entrypoint
        //
        // We go for option 3 because:
        //
        // - option 1, while "logically correct", results in 301-s when a user
        //   visiting the url types it without the trailing slash
        // - option 2 makes the behaviour inconsistent, making it depend on
        //   which entrypoints are configured
        if (!_.startsWith(requestedUrl, matchingEntrypoint.urlMatcher)) {
            return {
                statusCode: 301,
                headers: {
                    location: addTrailingSlash(request.path)
                }
            };
        }

        // If a redirect for the entrypoint is specified, redirect to it with a
        // 302. We don't use a 301 because the redirectTo property can be
        // dynamically changed by StaticDeploy admins
        if (matchingEntrypoint.redirectTo) {
            return {
                statusCode: 302,
                headers: {
                    location: matchingEntrypoint.redirectTo
                }
            };
        }

        // Throw a NoBundleOrRedirectToError if the matching entrypoint has no
        // deployed bundle and doesn't specify a redirect (as tested just above)
        if (!matchingEntrypoint.bundleId) {
            throw new NoBundleOrRedirectToError(matchingEntrypoint.urlMatcher);
        }

        // Find the matching asset
        const urlMatcherPath = matchingEntrypoint.urlMatcher.slice(
            matchingEntrypoint.urlMatcher.indexOf("/")
        );
        const requestedPath = toAbsolute(
            removePrefix(request.path, urlMatcherPath)
        );
        const linkedBundle = await this.storages.bundles.findOne(
            matchingEntrypoint.bundleId
        );
        if (!linkedBundle) {
            throw new StoragesInconsistencyError(
                `Entrypoint with id = ${matchingEntrypoint.id} links to a non-existing bundle with id = ${matchingEntrypoint.bundleId}`
            );
        }
        const fallbackAsset = _.find(linkedBundle.assets, {
            path: linkedBundle.fallbackAssetPath
        });
        if (!fallbackAsset) {
            throw new StoragesInconsistencyError(
                `Bundle with id = ${linkedBundle.id} specifies a non-existing fallback asset with path = ${linkedBundle.fallbackAssetPath}`
            );
        }
        const matchingAsset = findMatchingAsset(
            requestedPath,
            linkedBundle.assets,
            fallbackAsset
        );

        // When the requested path is not the canonical remote path, 301 to the
        // canonical remote path
        if (!isCanonicalPath(requestedPath, matchingAsset, fallbackAsset)) {
            const canonicalRemotePath = join(
                urlMatcherPath,
                matchingAsset.path
            );
            return {
                statusCode: 301,
                headers: {
                    location: canonicalRemotePath
                }
            };
        }

        // Get the matching asset content
        const content = await this.storages.bundles.getBundleAssetContent(
            linkedBundle.id,
            matchingAsset.path
        );
        if (!content) {
            throw new StoragesInconsistencyError(
                `Asset with path = ${matchingAsset.path} specified in bundle with id = ${linkedBundle.id} has no content`
            );
        }

        // Get the configuration script, if the asset is html
        const isHtmlAsset = matchingAsset.mimeType === "text/html";
        const configurationScript = isHtmlAsset
            ? getConfigurationScript(
                  await this.getConfiguration(matchingEntrypoint)
              )
            : null;

        // Return the asset response
        return {
            // When serving the fallback asset because no asset matched the
            // requested path, use the fallback status code specified in the
            // bundle
            statusCode:
                matchingAsset.path === fallbackAsset.path
                    ? linkedBundle.fallbackStatusCode
                    : 200,
            headers: {
                // Allow the mime type to be overridden by headers. This gives
                // the user the possibility to use more accurate mime types if
                // they so wish (instead of using the default ones derived from
                // the asset's extension)
                "content-type": matchingAsset.mimeType,
                ...(isHtmlAsset
                    ? whitelistInlineScript(
                          matchingAsset.headers,
                          configurationScript!.sha256
                      )
                    : matchingAsset.headers)
            },
            body: isHtmlAsset
                ? configureHtml(content, configurationScript!.content)
                : content
        };
    }

    private async getConfiguration(
        entrypoint: IEntrypoint
    ): Promise<IConfiguration> {
        let configuration: IConfiguration;
        if (entrypoint.configuration) {
            configuration = entrypoint.configuration;
        } else {
            const linkedApp = await this.storages.apps.findOne(
                entrypoint.appId
            );
            if (!linkedApp) {
                throw new StoragesInconsistencyError(
                    `Entrypoint with id = ${entrypoint.id} links to a non-existing app with id = ${entrypoint.appId}`
                );
            }
            configuration = linkedApp.defaultConfiguration;
        }
        return {
            ...configuration,
            // Inject additional configuration variables regarding the
            // entrypoint at which the asset is being served
            BASE_PATH: entrypoint.urlMatcher.slice(
                entrypoint.urlMatcher.indexOf("/")
            )
        };
    }
}
