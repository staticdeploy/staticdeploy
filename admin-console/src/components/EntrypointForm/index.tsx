import isEmpty from "lodash/isEmpty";
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

class EntrypointForm extends React.PureComponent<
    InjectedFormProps<IInternalFormValues>
> {
    render() {
        return (
            <form onSubmit={this.props.handleSubmit}>
                <TextField
                    label="Url matcher"
                    name="urlMatcher"
                    placeholder="sub.example.com/path/"
                    inlineError={true}
                />
                <TextField
                    label="Redirect to"
                    name="redirectTo"
                    placeholder="https://example.com/"
                    inlineError={true}
                />
                <ConfigurationField
                    label="Configuration"
                    name="configuration"
                />
            </form>
        );
    }
}

export interface IEntrypointFormInstance
    extends IConverterForm<IExternalFormValues> {}

export default reduxForm<IExternalFormValues, IInternalFormValues>({
    form: "EntrypointForm",
    validate: validate,
    toInternal: (initialValues = {}) => ({
        redirectTo: initialValues.redirectTo || "",
        urlMatcher: initialValues.urlMatcher || "",
        configuration: toKVPairs(initialValues.configuration || {})
    }),
    toExternal: values => ({
        redirectTo: values.redirectTo || null,
        urlMatcher: values.urlMatcher,
        configuration: !isEmpty(values.configuration)
            ? fromKVPairs(values.configuration)
            : null
    })
})(EntrypointForm);
