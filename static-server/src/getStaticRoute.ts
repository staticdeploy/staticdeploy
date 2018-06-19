import { configureHtml } from "@staticdeploy/app-config";
import { IAsset, IBundle, IConfiguration } from "@staticdeploy/common-types";
import { Request, Response } from "express";
import _ from "lodash";
import { find, startsWith } from "lodash";
import { join } from "path";

import addTrailingSlash from "common/addTrailingSlash";
import findMatchingAsset from "common/findMatchingAsset";
import isCanonicalPath from "common/isCanonicalPath";
import removePrefix from "common/removePrefix";
import toAbsolute from "common/toAbsolute";
import getNotFoundPage, {
    NotFoundError,
    NotFoundErrorCode
} from "getNotFoundPage";
import storage from "services/storage";

interface IStaticRouteOptions {
    hostnameHeader?: string;
}

export default (options: IStaticRouteOptions) => async (
    req: Request,
    res: Response
) => {
    // Get the hostname of the request
    const hostnameHeader =
        options.hostnameHeader && options.hostnameHeader.toLowerCase();
    const hostname = hostnameHeader
        ? (req.headers[hostnameHeader] as string) || req.hostname
        : req.hostname;

    // Find the matching entrypoint
    const url = join(hostname, req.path);
    const entrypoints = await storage.entrypoints.findAll();
    const matchingEntrypoint = _(entrypoints)
        .filter(
            entrypoint =>
                startsWith(url, entrypoint.urlMatcher) ||
                startsWith(addTrailingSlash(url), entrypoint.urlMatcher)
        )
        .sortBy("urlMatcher.length")
        .last();
    if (!matchingEntrypoint) {
        const notFoundError = new NotFoundError(
            NotFoundErrorCode.noEntrypointFound,
            { requestedUrl: url }
        );
        res.type("html")
            .status(404)
            .send(getNotFoundPage(notFoundError));
        return;
    }
    if (!startsWith(url, matchingEntrypoint.urlMatcher)) {
        /*
        *   We're in the situation in which the url requested equals one
        *   entrypoint's urlMatcher minus the trailing slash.
        *
        *   Example:
        *       entrypoint.urlMatcher === "domain.com/path/"
        *       requestedUrl === "domain.com/path"
        *
        *   In this situation other, shorter entrypoints might match the
        *   requested url, for instance an entrypoint with urlMatcher
        *   "domain.com/" in the example above.
        *
        *   We have three possible ways to handle the request:
        *
        *   1. serve the shorter matching entrypoint if present, 404 otherwise
        *   2. serve the shorter matching entrypoint if present, 301 to the
        *      with-trailing-slash-matching entrypoint otherwise
        *   3. always 301 to the with-trailing-slash-matching entrypoint
        *
        *   We go for option 3 because:
        *
        *   - option 1, while "logically correct", results in 404s when a user
        *     visiting the url types it without the trailing slash
        *   - option 2 makes the behaviour inconsistent, making it depend on
        *     which entrypoints are configured
        */
        res.redirect(301, addTrailingSlash(req.path));
        return;
    }

    // If a redirect for the entrypoint is specified, redirect to it with a 302.
    // We don't use a 301 because the redirectTo property can be dynamically
    // changed by the StaticDeploy admins
    if (matchingEntrypoint.redirectTo) {
        res.redirect(302, matchingEntrypoint.redirectTo);
        return;
    }

    // 404 if the matching entrypoint has no deployed bundle (and doesn't
    // specify a redirect, as tested just above)
    if (!matchingEntrypoint.bundleId) {
        const notFoundError = new NotFoundError(
            NotFoundErrorCode.noBundleDeployed,
            { matchingEntrypoint: matchingEntrypoint.urlMatcher }
        );
        res.type("html")
            .status(404)
            .send(getNotFoundPage(notFoundError));
        return;
    }

    // Find the matching asset
    const urlMatcherPath = matchingEntrypoint.urlMatcher.slice(
        matchingEntrypoint.urlMatcher.indexOf("/")
    );
    const requestedPath = toAbsolute(removePrefix(req.path, urlMatcherPath));
    const linkedBundle = (await storage.bundles.findOneById(
        matchingEntrypoint.bundleId
    )) as IBundle;
    const fallbackAsset = find(linkedBundle.assets, {
        path: linkedBundle.fallbackAssetPath
    }) as IAsset;
    const matchingAsset = findMatchingAsset(
        requestedPath,
        linkedBundle.assets,
        fallbackAsset
    );

    // When the requested path is not the canonical remote path, redirect to the
    // canonical remote path
    if (!isCanonicalPath(requestedPath, matchingAsset, fallbackAsset)) {
        const canonicalRemotePath = join(urlMatcherPath, matchingAsset.path);
        res.redirect(301, canonicalRemotePath);
        return;
    }

    // Get the matching asset content
    let content = await storage.bundles.getBundleAssetContent(
        matchingEntrypoint.bundleId,
        matchingAsset.path
    );

    // Configure the content
    if (matchingAsset.mimeType === "text/html") {
        let configuration: IConfiguration;
        if (matchingEntrypoint.configuration) {
            configuration = matchingEntrypoint.configuration;
        } else {
            const linkedApp = await storage.apps.findOneById(
                matchingEntrypoint.appId
            );
            configuration = linkedApp!.defaultConfiguration;
        }
        content = configureHtml({
            rawConfig: configuration,
            configKeyPrefix: "",
            html: content,
            selector: "script#app-config"
        });
    }

    // Serve the matching asset
    res.type(matchingAsset.mimeType)
        .status(200)
        .send(content);
};
