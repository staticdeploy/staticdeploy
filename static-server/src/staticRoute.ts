import { configureHtml } from "@staticdeploy/app-config";
import { IConfiguration } from "@staticdeploy/storage";
import { Request, Response } from "express";
import _ = require("lodash");
import { endsWith, maxBy, startsWith } from "lodash";
import { join } from "path";

import appendDotHtml from "common/appendDotHtml";
import appendIndexDotHtml from "common/appendIndexDotHtml";
import appendSlash from "common/appendSlash";
import removePrefix from "common/removePrefix";
import toAbsolute from "common/toAbsolute";
import storage from "services/storage";

// TODO: consider splitting into smaller functions
// TODO: pretty 404 pages
export default async (req: Request, res: Response) => {
    // Find matching entrypoint
    const url = join(req.hostname, req.path);
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
    if (!matchingEntrypoint.activeDeploymentId) {
        res
            .status(404)
            .send(
                `No active deployment found for entrypoint ${
                    matchingEntrypoint.urlMatcher
                }`
            );
        return;
    }

    // Find matching asset path
    const urlMatcherPath = matchingEntrypoint.urlMatcher.slice(
        matchingEntrypoint.urlMatcher.indexOf("/")
    );
    const requestedPath = toAbsolute(removePrefix(req.path, urlMatcherPath));
    const assetsPaths = await storage.deployments.listDeploymentAssetsPaths(
        matchingEntrypoint.activeDeploymentId
    );
    const matchingAssetsPaths = assetsPaths.filter(
        assetPath =>
            assetPath !== "/index.html" &&
            (endsWith(requestedPath, assetPath) ||
                endsWith(appendIndexDotHtml(requestedPath), assetPath) ||
                endsWith(appendDotHtml(requestedPath), assetPath))
    );
    const matchingAssetPath =
        maxBy(matchingAssetsPaths, "length") ||
        matchingEntrypoint.fallbackResource;

    if (
        matchingAssetPath !== matchingEntrypoint.fallbackResource &&
        matchingAssetPath !== requestedPath &&
        matchingAssetPath !== appendIndexDotHtml(requestedPath) &&
        matchingAssetPath !== appendDotHtml(requestedPath)
    ) {
        // Redirect to the canonical remote path
        const canonicalRemotePath = join(urlMatcherPath, matchingAssetPath);
        res.redirect(301, canonicalRemotePath);
        return;
    }

    const asset = await storage.deployments.getDeploymentAsset(
        matchingEntrypoint.activeDeploymentId,
        matchingAssetPath
    );

    if (!asset) {
        /*
        *   It should be possible for asset to be null only when
        *   matchingAssetPath === matchingEntrypoint.fallbackResource
        */
        if (matchingAssetPath !== matchingEntrypoint.fallbackResource) {
            req.log.error("Asset != fallbackResource not found");
        }
        res.status(404).send(`No asset found at ${matchingAssetPath}`);
        return;
    }

    // Serve the asset
    let content: Buffer;
    if (asset.mimeType === "text/html") {
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
            html: asset.content,
            selector: "script#app-config"
        });
    } else {
        content = asset.content;
    }

    res
        .type(asset.mimeType)
        .status(200)
        .send(content);
};
