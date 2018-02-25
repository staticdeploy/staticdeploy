import Button from "antd/lib/button";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import classnames from "classnames";
import React from "react";
import { FieldArray, FieldsProps, WrappedFieldArrayProps } from "redux-form";

import { IKVPair } from "../../common/configurationUtils";
import TextField from "../TextField";
import "./index.css";

interface IProps {
    name: string;
    label?: string;
    colon?: boolean;
}

export class WrappedConfigurationField extends React.PureComponent<
    IProps & WrappedFieldArrayProps<IKVPair>
> {
    static defaultProps = { colon: true };
    renderLabel() {
        return this.props.label ? (
            <div className="ant-form-item-label">
                <label title={this.props.label}>{this.props.label}</label>
            </div>
        ) : null;
    }
    renderKVPairFields(
        fieldName: string,
        index: number,
        fields: FieldsProps<IKVPair>
    ) {
        return (
            <Row key={index} gutter={8}>
                <Col span={9}>
                    <TextField
                        name={`${fieldName}.key`}
                        placeholder="Variable name"
                        inlineError={true}
                    />
                </Col>
                <Col span={13}>
                    <TextField
                        name={`${fieldName}.value`}
                        placeholder="Value"
                    />
                </Col>
                <Col span={2}>
                    <Button
                        className="c-ConfigurationField-remove-button"
                        icon="delete"
                        onClick={() => fields.remove(index)}
                    />
                </Col>
            </Row>
        );
    }
    render() {
        const { fields } = this.props;
        const className = classnames("c-ConfigurationField", {
            "ant-form-item-no-colon": !this.props.colon
        });
        return (
            <div className={className}>
                {this.renderLabel()}
                {fields.map(this.renderKVPairFields)}
                <Button
                    className="c-ConfigurationField-add-button"
                    onClick={() => fields.push({ key: "", value: "" })}
                >
                    {"Add variable"}
                </Button>
            </div>
        );
    }
}

export default class ConfigurationField extends React.PureComponent<IProps> {
    render() {
        return (
            <FieldArray
                name={this.props.name}
                // TODO: figure out how to correctly type this
                component={WrappedConfigurationField as any}
                props={this.props}
            />
        );
    }
}
