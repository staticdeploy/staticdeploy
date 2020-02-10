import IFormValues from "./IFormValues";

export default function validate(values: Partial<IFormValues>) {
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
