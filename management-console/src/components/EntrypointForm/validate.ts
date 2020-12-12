import { isEntrypointUrlMatcherValid } from "@staticdeploy/core";

import { getErrors } from "../../common/configurationUtils";
import { IInternalFormValues } from "./IFormValues";

export default function validate(values: Partial<IInternalFormValues>) {
    const errors: any = {};

    // Validate urlMatcher
    if (!values.urlMatcher) {
        errors.urlMatcher = "Required";
    } else if (!isEntrypointUrlMatcherValid(values.urlMatcher)) {
        errors.urlMatcher =
            "Must have format: domain (w/o trailing dot) + path + trailing slash";
    }

    // Validate configuration
    const configurationErrors = getErrors(values.configuration);
    if (configurationErrors) {
        errors.configuration = configurationErrors;
    }

    return errors;
}
