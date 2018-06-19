import { IAsset } from "@staticdeploy/common-types";
import { join } from "path";

import appendDotHtml from "./appendDotHtml";
import appendIndexDotHtml from "./appendIndexDotHtml";

/*
*   A requested path is considered canonical for a matching asset if:
*
*       - the requested path perfectly matches the matching asset path (with or
*         without a trailing / )
*
*       - the requested path dot-html matches the matching asset path
*
*       - the requested path index-dot-html matches the matching asset path
*
*       - the matching asset is the fallback asset. If we're in this situation
*         it means that there is no "truly" matching asset for the requested
*         path, hence no canonical path for it, hence the requested path is
*         already canonical. We don't make the fallback asset path the canonical
*         path because it would have an undesirable behaviour when serving SPAs
*         and when serving statically generated websites (in the first case we
*         probably want to serve index.html as fallback resource, maintaining
*         the requested url intact so that the app can do client side routing.
*         In the second case we probably want to serve a 404 page, maintaining
*         the requested path so the user can see what resource was not found)
*/
export default function isCanonicalPath(
    requestedPath: string,
    matchingAsset: IAsset,
    fallbackAsset: IAsset
): boolean {
    return (
        matchingAsset.path === fallbackAsset.path ||
        matchingAsset.path === requestedPath ||
        join(matchingAsset.path, "/") === requestedPath ||
        matchingAsset.path === appendDotHtml(requestedPath) ||
        matchingAsset.path === appendIndexDotHtml(requestedPath)
    );
}
