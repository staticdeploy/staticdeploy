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
                    label="Fallback resource"
                    name="fallbackResource"
                    inlineError={true}
                />
                <ConfigurationField
                    label="Default configuration"
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
        urlMatcher: initialValues.urlMatcher || "",
        fallbackResource: initialValues.fallbackResource || "/index.html",
        configuration: toKVPairs(initialValues.configuration || {})
    }),
    toExternal: values => ({
        urlMatcher: values.urlMatcher,
        fallbackResource: values.fallbackResource || "/index.html",
        configuration: !isEmpty(values.configuration)
            ? fromKVPairs(values.configuration)
            : undefined
    })
})(EntrypointForm);
