import { isAppNameValid } from "@staticdeploy/core";

import { getErrors } from "../../common/configurationUtils";
import { IInternalFormValues } from "./IFormValues";

export default function validate(values: Partial<IInternalFormValues>) {
    const errors: any = {};

    // Validate name
    if (!values.name) {
        errors.name = "Required";
    } else if (!isAppNameValid(values.name)) {
        errors.name =
            "Can only contain letters, numbers, underscores, dashes, dots, and slashes";
    }

    // Validate defaultConfiguration
    const defaultConfigurationErrors = getErrors(values.defaultConfiguration);
    if (defaultConfigurationErrors) {
        errors.defaultConfiguration = defaultConfigurationErrors;
    }

    return errors;
}
