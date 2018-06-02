import { configureHtml } from "@staticdeploy/app-config";
import { IConfiguration } from "@staticdeploy/common-types";
import { BundleAssetNotFoundError } from "@staticdeploy/storage";
import { Request, Response } from "express";
import _ from "lodash";
import { endsWith, maxBy, startsWith } from "lodash";
import { join } from "path";

import appendDotHtml from "common/appendDotHtml";
import appendIndexDotHtml from "common/appendIndexDotHtml";
import appendSlash from "common/appendSlash";
import removePrefix from "common/removePrefix";
import toAbsolute from "common/toAbsolute";
import storage from "services/storage";

interface IStaticRouteOptions {
    hostnameHeader?: string;
}

// TODO: pretty 404 pages
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
                startsWith(appendSlash(url), entrypoint.urlMatcher)
        )
        .sortBy("urlMatcher.length")
        .last();
    if (!matchingEntrypoint) {
        res.status(404).send(`No entrypoint found matching url ${url}`);
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
        *   requetsed url, for instance an entrypoint with urlMatcher
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
        res.redirect(301, appendSlash(req.path));
        return;
    }

    // If a redirect for the entrypoint is specified, redirect to it with a 302.
    // We don't use a 301 because the redirectTo property can be dinamically
    // changed by the staticdeploy admins
    if (matchingEntrypoint.redirectTo) {
        res.redirect(302, matchingEntrypoint.redirectTo);
        return;
    }

    if (!matchingEntrypoint.bundleId) {
        res.status(404).send(
            `No bundle deployed for entrypoint ${matchingEntrypoint.urlMatcher}`
        );
        return;
    }

    // Find the matching asset
    const urlMatcherPath = matchingEntrypoint.urlMatcher.slice(
        matchingEntrypoint.urlMatcher.indexOf("/")
    );
    const requestedPath = toAbsolute(removePrefix(req.path, urlMatcherPath));
    const linkedBundle = await storage.bundles.findOneById(
        matchingEntrypoint.bundleId
    );
    const matchingAssets = linkedBundle!.assets.filter(
        ({ path }) =>
            path !== "/index.html" &&
            (endsWith(requestedPath, path) ||
                endsWith(appendIndexDotHtml(requestedPath), path) ||
                endsWith(appendDotHtml(requestedPath), path))
    );
    const matchingAsset = maxBy(matchingAssets, "path.length") || {
        path: "/index.html",
        mimeType: "text/html"
    };

    // When the requested path is not the canonical remote path, redirect to the
    // canonical remote path
    if (
        matchingAsset.path !== "/index.html" &&
        matchingAsset.path !== requestedPath &&
        matchingAsset.path !== appendIndexDotHtml(requestedPath) &&
        matchingAsset.path !== appendDotHtml(requestedPath)
    ) {
        const canonicalRemotePath = join(urlMatcherPath, matchingAsset.path);
        res.redirect(301, canonicalRemotePath);
        return;
    }

    // Get the matching asset content
    let content;
    try {
        content = await storage.bundles.getBundleAssetContent(
            matchingEntrypoint.bundleId,
            matchingAsset.path
        );
    } catch (err) {
        // This should only throw when matchingAssetPath === /index.html, but
        // the linked bundle doesn't have an /index.html asset
        if (err instanceof BundleAssetNotFoundError) {
            res.status(404).send();
            return;
        }
        throw err;
    }

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
