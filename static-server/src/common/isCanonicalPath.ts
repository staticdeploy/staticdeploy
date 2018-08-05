import { IAsset } from "@staticdeploy/common-types";
import { join } from "path";

import appendDotHtml from "./appendDotHtml";
import appendIndexDotHtml from "./appendIndexDotHtml";

/*
*   A requested path is considered canonical for a matching asset if:
*
*       - the requested path equals the matching asset path
*
*       - the requested path + / equals the matching asset path
*
*       - the requested path + .html equals the matching asset path
*
*       - the requested path + /index.html equals the matching asset path
*
*       - the matching asset is the fallback asset. We're in this situation if:
*
*           - there is no "truly" matching asset for the requested path, hence
*             no canonical path for it, hence the requested path is already
*             canonical. We don't make the fallback asset path the canonical
*             path because it would have an undesirable behaviour when serving
*             SPAs and when serving statically generated websites: in the first
*             case we probably want to serve index.html as fallback asset,
*             maintaining the requested url intact so that the app can do client
*             side routing. In the second case we probably want to serve a 404
*             page, maintaining the requested url intact so the user can see
*             what resource was not found
*
*           - the requested path matches the fallback asset path. In this case
*             we _could_ redirect to the exact path of the fallback asset, but
*             it would complicate the code quite a bit (we would have to pay
*             special attention to the case where the fallback asset is
*             /index.html), and at the moment it's not clear whether redirecting
*             would have benefits or cause problems. Therefore, for the moment
+             we don't perform the redirect and we consider the requested path
*             canonical
*/
export default function isCanonicalPath(
    requestedPath: string,
    matchingAsset: IAsset,
    fallbackAsset: IAsset
): boolean {
    return (
        matchingAsset.path === requestedPath ||
        join(matchingAsset.path, "/") === requestedPath ||
        matchingAsset.path === appendDotHtml(requestedPath) ||
        matchingAsset.path === appendIndexDotHtml(requestedPath) ||
        matchingAsset.path === fallbackAsset.path
    );
}
