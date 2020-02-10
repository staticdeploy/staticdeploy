import { IExternalCache, IExternalCacheType } from "@staticdeploy/core";
import Divider from "antd/lib/divider";
import find from "lodash/find";
import React from "react";

import TextFieldRO from "../TextFieldRO";
import "./index.css";

interface IProps {
    title: React.ReactNode;
    externalCacheType: IExternalCache["type"];
    externalCacheConfiguration: IExternalCache["configuration"];
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
            <TextFieldRO
                key={configurationField.name}
                title={configurationField.label}
                value={
                    this.props.externalCacheConfiguration[
                        configurationField.name
                    ] ?? "-"
                }
            />
        ));
    }
    render() {
        return (
            <div className="c-ExternalCacheConfigurationField">
                <Divider>{this.props.title}</Divider>
                {this.renderFields()}
            </div>
        );
    }
}
