import { endsWith, isEmpty, maxBy } from "lodash";
import { join } from "path";

import { IAsset } from "../../entities/Asset";
import appendDotHtml from "./appendDotHtml";
import appendIndexDotHtml from "./appendIndexDotHtml";

/*
 *  Given a request path, the request path matches an asset when:
 *
 *      - the request path, optionally minus the trailing / , _ends with_ the
 *        asset path (perfectly matching asset)
 *
 *      - the request path, optionally minus the trailing / , plus .html _ends
 *        with_ the asset path (dot-html matching asset)
 *
 *      - the request path, optionally minus the trailing /, plus /index.html
 *        _ends with_ the asset path (index-dot-html matching asset), UNLESS the
 *        asset path is /index.html, which would match with _any_ path since we
 *        append to it /index.html. If the asset path is /index.html, only path
 *        "/" index-dot-html matches with it
 *
 *  Examples:
 *
 *      - request paths /path and /path/:
 *          - perfectly match asset /path
 *          - dot-html match asset /path.html
 *          - index-dot-html match asset /path/index.html
 *          - DO NOT index-dot-html match asset /index.html
 *
 *      - request paths /path.html and /path.html/:
 *          - perfectly match asset /path.html
 *          - dot-html match asset /path.html.html
 *          - index-dot-html match asset /path.html/index.html
 *          - DO NOT index-dot-html match asset /index.html
 *
 *      - request paths /prefix/path and /prefix/path/:
 *          - perfectly match asset /prefix/path
 *          - perfectly match asset /path
 *          - dot-html match asset /prefix/path.html
 *          - dot-html match asset /path.html
 *          - index-dot-html match asset /prefix/path/index.html
 *          - index-dot-html match asset /path/index.html
 *          - DO NOT index-dot-html match asset /index.html
 *
 *  Two or more assets can match a given requested path. To chose the _best_
 *  matching asset, the following priority rules are used:
 *
 *      - perfectly matching assets have priority over dot-html and
 *        index-dot-html assets
 *
 *      - dot-html assets have priority over index-dot-html assets
 *
 *      - longer assets have priority over shorter assets
 *
 *  Examples:
 *
 *      - /path > /path.html
 *      - /path > /path/index.html
 *      - /path.html > /path/index.html
 *      - /prefix/path > /path
 *      - /prefix/path.html > /path.html
 *      - /prefix/path/index.html > /path/index.html
 */
export default function findMatchingAsset(
    requestedPath: string,
    assets: IAsset[],
    fallbackAsset: IAsset
): IAsset {
    const perfectlyMatching = assets.filter(
        ({ path }) =>
            endsWith(requestedPath, path) ||
            endsWith(requestedPath, join(path, "/"))
    );
    if (!isEmpty(perfectlyMatching)) {
        return maxBy(perfectlyMatching, "path.length")!;
    }

    const matchingWithDotHtml = assets.filter(({ path }) =>
        endsWith(appendDotHtml(requestedPath), path)
    );
    if (!isEmpty(matchingWithDotHtml)) {
        return maxBy(matchingWithDotHtml, "path.length")!;
    }

    const matchingWithIndexDotHtml = assets.filter(({ path }) =>
        path === "/index.html"
            ? requestedPath === "/" || requestedPath === "/index.html"
            : endsWith(appendIndexDotHtml(requestedPath), path)
    );
    if (!isEmpty(matchingWithIndexDotHtml)) {
        return maxBy(matchingWithIndexDotHtml, "path.length")!;
    }

    // When no asset matches, use the fallback asset
    return fallbackAsset;
}
