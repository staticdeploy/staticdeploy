import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import Button from "antd/lib/button";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import React from "react";
import {
    FieldArray,
    FieldArrayFieldsProps,
    WrappedFieldArrayProps,
} from "redux-form";

import { IKVPair } from "../../common/configurationUtils";
import TextField from "../TextField";
import "./index.css";

interface IProps {
    name: string;
    label?: string;
}

export class WrappedConfigurationField extends React.Component<
    IProps & WrappedFieldArrayProps<IKVPair>
> {
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
        fields: FieldArrayFieldsProps<IKVPair>
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
                        icon={<DeleteOutlined />}
                        onClick={() => fields.remove(index)}
                    />
                </Col>
            </Row>
        );
    }
    render() {
        const { fields } = this.props;
        return (
            <div className="c-ConfigurationField">
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

export default class ConfigurationField extends React.Component<IProps> {
    render() {
        return (
            <FieldArray
                name={this.props.name}
                component={WrappedConfigurationField}
                props={this.props}
            />
        );
    }
}
