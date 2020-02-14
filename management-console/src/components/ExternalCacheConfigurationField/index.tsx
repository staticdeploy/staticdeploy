import { IExternalCache, IExternalCacheType } from "@staticdeploy/core";
import Divider from "antd/lib/divider";
import find from "lodash/find";
import React from "react";
import { FormSection } from "redux-form";

import TextField from "../TextField";
import "./index.css";

interface IProps {
    name: string;
    label: string;
    externalCacheType?: IExternalCache["type"];
    supportedExternalCacheTypes: IExternalCacheType[];
}

export default class ExternalCacheConfigurationField extends React.Component<
    IProps
> {
    renderFields() {
        const externalCacheType = find(this.props.supportedExternalCacheTypes, {
            name: this.props.externalCacheType
        })!;
        return externalCacheType.configurationFields.map(configurationField => (
            <TextField
                key={configurationField.name}
                name={configurationField.name}
                label={configurationField.label}
                placeholder={configurationField.placeholder}
                inlineError={true}
            />
        ));
    }
    render() {
        return this.props.externalCacheType ? (
            <FormSection
                name={this.props.name}
                className="c-ExternalCacheConfigurationField"
            >
                <Divider>{this.props.label}</Divider>
                {this.renderFields()}
            </FormSection>
        ) : null;
    }
}
