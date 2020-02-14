import React from "react";

import { fromKVPairs, toKVPairs } from "../../common/configurationUtils";
import {
    IConverterForm,
    IInjectedFormProps,
    reduxForm
} from "../../common/formWithValuesConverter";
import ConfigurationField from "../ConfigurationField";
import TextField from "../TextField";
import { IExternalFormValues, IInternalFormValues } from "./IFormValues";
import validate from "./validate";

interface IProps {
    isEditForm?: boolean;
}

class AppForm extends React.Component<
    IProps & IInjectedFormProps<IInternalFormValues>
> {
    render() {
        const { isEditForm } = this.props;
        return (
            <form onSubmit={this.props.handleSubmit}>
                <TextField
                    label="Name"
                    name="name"
                    inlineError={true}
                    disabled={isEditForm}
                />
                <ConfigurationField
                    label="Default configuration"
                    name="defaultConfiguration"
                />
            </form>
        );
    }
}

export interface IAppFormInstance extends IConverterForm<IExternalFormValues> {}

export default reduxForm<IExternalFormValues, IInternalFormValues, IProps>({
    form: "AppForm",
    validate: validate,
    toInternal: initialValues => ({
        name: initialValues.name,
        defaultConfiguration: toKVPairs(initialValues.defaultConfiguration)
    }),
    toExternal: values => ({
        name: values.name,
        defaultConfiguration: fromKVPairs(values.defaultConfiguration)
    })
})(AppForm);
