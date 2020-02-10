import { IExternalCacheType } from "@staticdeploy/core";
import React from "react";

import {
    IConverterForm,
    IInjectedFormProps,
    reduxForm
} from "../../common/formWithValuesConverter";
import ExternalCacheConfigurationField from "../ExternalCacheConfigurationField";
import ExternalCacheTypeField from "../ExternalCacheTypeField";
import TextField from "../TextField";
import IFormValues from "./IFormValues";
import validate from "./validate";

interface IProps {
    supportedExternalCacheTypes: IExternalCacheType[];
}

class ExternalCacheForm extends React.Component<
    IProps & IInjectedFormProps<IFormValues>
> {
    render() {
        return (
            <form onSubmit={this.props.handleSubmit}>
                <TextField
                    label="Domain"
                    name="domain"
                    placeholder="sub.example.com"
                    inlineError={true}
                />
                <ExternalCacheTypeField
                    label="Type"
                    name="type"
                    placeholder="Choose type"
                    supportedExternalCacheTypes={
                        this.props.supportedExternalCacheTypes
                    }
                />
                <ExternalCacheConfigurationField
                    label="Configuration"
                    name="configuration"
                    externalCacheType={this.props.getValues()?.type}
                    supportedExternalCacheTypes={
                        this.props.supportedExternalCacheTypes
                    }
                />
            </form>
        );
    }
}

export interface IExternalCacheFormInstance
    extends IConverterForm<IFormValues> {}

export default reduxForm<IFormValues, IFormValues, IProps>({
    form: "ExternalCacheForm",
    validate: validate,
    onChange: (currentValues, previousValues, change) => {
        if (previousValues.type && currentValues.type !== previousValues.type) {
            change("configuration", {});
        }
    }
})(ExternalCacheForm);
