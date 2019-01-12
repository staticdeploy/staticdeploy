import { every, isPlainObject, isString } from "lodash";
import { isAbsolute, normalize } from "path";
import { isFQDN } from "validator";

import * as errors from "./errors";

/*
 *  Regexp that matches strings containing only:
 *  - alphanumeric characters from the basic Latin alphabet
 *  - underscores, dashes, dots, and slashes
 *
 *  Strings only containing these basic characters are:
 *  - unambiguous to read (with a monospaced font)
 *  - easy to type in a shell
 *  - easy to display in a url
 */
const basicCharsRegexp = /^[\w-\.\/]{1,255}$/;

/*
 *  A valid configuration object is a (string, string) dictionary
 */
export function isConfigurationValid(configuration: any) {
    return isPlainObject(configuration) && every(configuration, isString);
}
export function validateConfiguration(
    configuration: any,
    configurationProperty: string
) {
    if (!isConfigurationValid(configuration)) {
        throw new errors.ConfigurationNotValidError(configurationProperty);
    }
}

/*
 *  An app name is valid when:
 *  - has 0 < length < 256
 *  - contains only characters from the basicChars subset specified above
 */
export function isAppNameValid(name: string) {
    return basicCharsRegexp.test(name);
}
export function validateAppName(name: string) {
    if (!isAppNameValid(name)) {
        throw new errors.AppNameNotValidError(name);
    }
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
        throw new errors.EntrypointUrlMatcherNotValidError(urlMatcher);
    }
}

/*
 *  Bundle name and tag strings have the same validation rules:
 *  - 0 < length < 256
 *  - allowed characters are the ones from the basicChars subset specified above
 */
export function isBundleNameOrTagValid(nameOrTag: string): boolean {
    return basicCharsRegexp.test(nameOrTag);
}
export function validateBundleNameOrTag(
    nameOrTag: string,
    type: "name" | "tag"
): void {
    if (!isBundleNameOrTagValid(nameOrTag)) {
        throw new errors.BundleNameOrTagNotValidError(nameOrTag, type);
    }
}

/*
 *  A bundle name:tag combination is a string joining name and tag with a colon
 *  character (:)
 */
export function isBundleNameTagCombinationValid(
    nameTagCombination: string
): boolean {
    const segments = nameTagCombination.split(":");
    if (segments.length !== 2) {
        return false;
    }
    const [name, tag] = segments;
    return isBundleNameOrTagValid(name) && isBundleNameOrTagValid(tag);
}
export function validateBundleNameTagCombination(
    nameTagCombination: string
): void {
    if (!isBundleNameTagCombinationValid(nameTagCombination)) {
        throw new errors.BundleNameTagCombinationNotValidError(
            nameTagCombination
        );
    }
}
