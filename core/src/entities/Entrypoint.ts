import { isAbsolute, normalize } from "path";
import { isFQDN } from "validator";

import { EntrypointUrlMatcherNotValidError } from "../common/errors";
import { IConfiguration } from "./Configuration";

export interface IEntrypoint {
    id: string;
    appId: string;
    bundleId: string | null;
    redirectTo: string | null;
    urlMatcher: string;
    configuration: IConfiguration | null;
    createdAt: Date;
    updatedAt: Date;
}

/*
 *  A valid entrypoint urlMatcher has the shape domain + path, where domain is a
 *  fully-qualified domain name, and path an absolute and normalized path
 *  ending with a /.
 *
 *  Example of valid urlMatchers:
 *  - domain.com/
 *  - domain.com/path/
 *  - subdomain.domain.com/path/subpath/
 *
 *  Example of invalid urlMatchers:
 *  - http://domain.com/
 *  - domain.com
 *  - domain.com/path
 */
export function isEntrypointUrlMatcherValid(urlMatcher: string): boolean {
    const indexOfFirstSlash = urlMatcher.indexOf("/");
    // Must contain at least a / to be valid
    if (indexOfFirstSlash === -1) {
        return false;
    }
    const domain = urlMatcher.slice(0, indexOfFirstSlash);
    const path = urlMatcher.slice(indexOfFirstSlash);
    return (
        isFQDN(domain) &&
        isAbsolute(path) &&
        normalize(path) === path &&
        /\/$/.test(path)
    );
}
export function validateEntrypointUrlMatcher(urlMatcher: string): void {
    if (!isEntrypointUrlMatcherValid(urlMatcher)) {
        throw new EntrypointUrlMatcherNotValidError(urlMatcher);
    }
}
