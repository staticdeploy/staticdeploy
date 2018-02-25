import React from "react";
import { InjectedFormProps } from "redux-form";

import { fromKVPairs, toKVPairs } from "../../common/configurationUtils";
import {
    IConverterForm,
    reduxForm
} from "../../common/formWithValuesConverter";
import ConfigurationField from "../ConfigurationField";
import TextField from "../TextField";
import { IExternalFormValues, IInternalFormValues } from "./IFormValues";
import validate from "./validate";

class AppForm extends React.PureComponent<
    InjectedFormProps<IInternalFormValues>
> {
    render() {
        return (
            <form onSubmit={this.props.handleSubmit}>
                <TextField label="Name" name="name" inlineError={true} />
                <ConfigurationField
                    label="Default configuration"
                    name="defaultConfiguration"
                />
            </form>
        );
    }
}

export interface IAppFormInstance extends IConverterForm<IExternalFormValues> {}

export default reduxForm<IExternalFormValues, IInternalFormValues>({
    form: "AppForm",
    validate: validate,
    toInternal: (initialValues = {}) => ({
        name: initialValues.name || "",
        defaultConfiguration: toKVPairs(
            initialValues.defaultConfiguration || {}
        )
    }),
    toExternal: values => ({
        name: values.name,
        defaultConfiguration: fromKVPairs(values.defaultConfiguration)
    })
})(AppForm);
