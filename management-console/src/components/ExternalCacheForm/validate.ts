import {
    IExternalCacheType,
    isExternalCacheDomainValid
} from "@staticdeploy/core";
import find from "lodash/find";
import isEmpty from "lodash/isEmpty";
import set from "lodash/set";

import IFormValues from "./IFormValues";

export default function validate(
    values: Partial<IFormValues>,
    props: { supportedExternalCacheTypes: IExternalCacheType[] }
) {
    const errors: any = {};

    // Validate domain
    if (!values.domain) {
        errors.domain = "Required";
    } else if (!isExternalCacheDomainValid(values.domain)) {
        errors.domain = "Must be a valid domain name";
    }

    // Validate type
    if (!values.type) {
        errors.type = "Required";
    }

    // Validate configuration
    if (values.type) {
        const externalCacheType = find(props.supportedExternalCacheTypes, {
            name: values.type
        })!;
        externalCacheType.configurationFields.forEach(configurationField => {
            if (
                isEmpty(values.configuration) ||
                isEmpty(values.configuration![configurationField.name])
            ) {
                set(
                    errors,
                    ["configuration", configurationField.name],
                    "Required"
                );
            }
        });
    }

    return errors;
}
