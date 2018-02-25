import isFQDN from "validator/lib/isFQDN";

import { getErrors } from "../../common/configurationUtils";
import { IInternalFormValues } from "./IFormValues";

/*
*   A valid urlMatcher has the shape domain + path, where domain is a
*   fully-qualified domain name, and path an absolute and normalized path
*   ending with a /.
*
*   Example of valid urlMatchers:
*   - domain.com/
*   - domain.com/path/
*   - subdomain.domain.com/path/subpath/
*
*   Example of invalid urlMatchers:
*   - http://domain.com/
*   - domain.com
*   - domain.com/path
*/
function isUrlMatcherValid(urlMatcher: string): boolean {
    const indexOfFirstSlash = urlMatcher.indexOf("/");
    // Must contain at least a / to be valid
    if (indexOfFirstSlash === -1) {
        return false;
    }
    const domain = urlMatcher.slice(0, indexOfFirstSlash);
    const path = urlMatcher.slice(indexOfFirstSlash);
    return (
        isFQDN(domain) &&
        // Test is normalized:
        // does not contain /./
        !/\/\.\//.test(path) &&
        // does not contain /../
        !/\/\.\.\//.test(path) &&
        // does not contain multiple consecutive /
        !/\/{2,}/.test(path) &&
        // Test trailing slash
        /\/$/.test(path)
    );
}

export default function validate(values: Partial<IInternalFormValues>) {
    const errors: any = {};

    // Validate urlMatcher
    if (!values.urlMatcher) {
        errors.urlMatcher = "Required";
    } else if (!isUrlMatcherValid(values.urlMatcher)) {
        errors.urlMatcher = "Must have format: domain + path + trailing slash";
    }

    // Validate configuration
    const configurationErrors = getErrors(values.configuration);
    if (configurationErrors) {
        errors.configuration = configurationErrors;
    }

    return errors;
}
