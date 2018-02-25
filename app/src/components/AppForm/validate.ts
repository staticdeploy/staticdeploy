import { getErrors } from "../../common/configurationUtils";
import { IInternalFormValues } from "./IFormValues";

export default function validate(values: Partial<IInternalFormValues>) {
    const errors: any = {};

    // Validate name
    if (!values.name) {
        errors.name = "Required";
    } else if (!/^[a-zA-Z0-9-]+$/.test(values.name)) {
        errors.name = "Can only contain letters, numbers and hyphens";
    }

    // Validate defaultConfiguration
    const defaultConfigurationErrors = getErrors(values.defaultConfiguration);
    if (defaultConfigurationErrors) {
        errors.defaultConfiguration = defaultConfigurationErrors;
    }

    return errors;
}
