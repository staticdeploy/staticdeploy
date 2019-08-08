import React from "react";
import { InjectedFormProps } from "redux-form";

import {
    IConverterForm,
    reduxForm
} from "../../common/formWithValuesConverter";
import RolesField from "../RolesField";
import TextField from "../TextField";
import { IExternalFormValues, IInternalFormValues } from "./IFormValues";
import validate from "./validate";

class GroupForm extends React.Component<
    InjectedFormProps<IInternalFormValues>
> {
    render() {
        return (
            <form onSubmit={this.props.handleSubmit}>
                <TextField label="Name" name="name" inlineError={true} />
                <RolesField label="Roles" name="roles" />
            </form>
        );
    }
}

export interface IGroupFormInstance
    extends IConverterForm<IExternalFormValues> {}

export default reduxForm<IExternalFormValues, IInternalFormValues>({
    form: "GroupForm",
    validate: validate,
    toInternal: (initialValues = {}) => ({
        name: initialValues.name || "",
        roles: initialValues.roles || []
    }),
    toExternal: values => ({
        name: values.name,
        roles: values.roles
    })
})(GroupForm);
