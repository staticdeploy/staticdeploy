import { UserType } from "@staticdeploy/core";
import Form from "antd/lib/form";
import Icon from "antd/lib/icon";
import Select from "antd/lib/select";
import upperFirst from "lodash/upperFirst";
import React from "react";
import { Field, WrappedFieldProps } from "redux-form";

import "./index.css";

interface IProps {
    name: string;
    label: string;
    disabled?: boolean;
}

export class WrappedUserTypeField extends React.Component<
    WrappedFieldProps & IProps
> {
    render() {
        return (
            <Form.Item label={this.props.label} className="c-UserTypeField">
                <Select
                    value={this.props.input.value}
                    onChange={this.props.input.onChange}
                    onBlur={this.props.input.onBlur}
                    disabled={this.props.disabled}
                >
                    <Select.Option value={UserType.Human}>
                        <Icon type="user" />
                        <span className="c-UserTypeField-option-name">
                            {upperFirst(UserType.Human)}
                        </span>
                    </Select.Option>
                    <Select.Option value={UserType.Machine}>
                        <Icon type="robot" />
                        <span className="c-UserTypeField-option-name">
                            {upperFirst(UserType.Machine)}
                        </span>
                    </Select.Option>
                </Select>
            </Form.Item>
        );
    }
}

export default class UserTypeField extends React.Component<IProps> {
    render() {
        return (
            <Field
                name={this.props.name}
                component={WrappedUserTypeField}
                props={this.props}
            />
        );
    }
}
