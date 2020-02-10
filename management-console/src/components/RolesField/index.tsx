import Button from "antd/lib/button";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import React from "react";
import {
    FieldArray,
    FieldArrayFieldsProps,
    WrappedFieldArrayProps
} from "redux-form";

import TextField from "../TextField";
import "./index.css";

interface IProps {
    name: string;
    label: string;
}

export class WrappedRolesField extends React.Component<
    IProps & WrappedFieldArrayProps<string>
> {
    renderLabel() {
        return this.props.label ? (
            <div className="ant-form-item-label">
                <label title={this.props.label}>{this.props.label}</label>
            </div>
        ) : null;
    }
    renderRoleField(
        fieldName: string,
        index: number,
        fields: FieldArrayFieldsProps<string>
    ) {
        return (
            <Row key={index} gutter={8}>
                <Col span={22}>
                    <TextField name={fieldName} inlineError={true} />
                </Col>
                <Col span={2}>
                    <Button
                        className="c-RolesField-remove-button"
                        icon="delete"
                        onClick={() => fields.remove(index)}
                    />
                </Col>
            </Row>
        );
    }
    render() {
        const { fields } = this.props;
        return (
            <div className="c-RolesField">
                {this.renderLabel()}
                {fields.map(this.renderRoleField)}
                <Button
                    className="c-RolesField-add-button"
                    onClick={() => fields.push("")}
                >
                    {"Add role"}
                </Button>
            </div>
        );
    }
}

export default class RolesField extends React.Component<IProps> {
    render() {
        return (
            <FieldArray
                name={this.props.name}
                component={WrappedRolesField}
                props={this.props}
            />
        );
    }
}
