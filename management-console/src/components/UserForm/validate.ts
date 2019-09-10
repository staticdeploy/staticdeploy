import { IInternalFormValues } from "./IFormValues";

export default function validate(values: Partial<IInternalFormValues>) {
    const errors: any = {};

    // Validate idp
    if (!values.idp) {
        errors.idp = "Required";
    }

    // Validate idpId
    if (!values.idpId) {
        errors.idpId = "Required";
    }

    // Validate name
    if (!values.name) {
        errors.name = "Required";
    }

    return errors;
}
