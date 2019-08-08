import { isRoleValid } from "@staticdeploy/core";
import { set } from "lodash";

import { IInternalFormValues } from "./IFormValues";

export default function validate(values: Partial<IInternalFormValues>) {
    const errors: any = {};

    // Validate name
    if (!values.name) {
        errors.name = "Required";
    }

    // Validate roles
    if (values.roles) {
        values.roles.forEach((role, index) => {
            // role can sometimes be undefined
            if (!role) {
                set(errors, ["roles", index], "Required");
            } else if (!isRoleValid(role)) {
                set(errors, ["roles", index], "Invalid role");
            }
        });
    }

    return errors;
}
