import React from "react";

import {
    IConverterForm,
    IInjectedFormProps,
    reduxForm
} from "../../common/formWithValuesConverter";
import RolesField from "../RolesField";
import TextField from "../TextField";
import IFormValues from "./IFormValues";
import validate from "./validate";

class GroupForm extends React.Component<IInjectedFormProps<IFormValues>> {
    render() {
        return (
            <form onSubmit={this.props.handleSubmit}>
                <TextField label="Name" name="name" inlineError={true} />
                <RolesField label="Roles" name="roles" />
            </form>
        );
    }
}

export interface IGroupFormInstance extends IConverterForm<IFormValues> {}

export default reduxForm<IFormValues>({
    form: "GroupForm",
    validate: validate
})(GroupForm);
