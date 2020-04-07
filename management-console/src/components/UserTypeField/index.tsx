import RobotOutlined from "@ant-design/icons/RobotOutlined";
import UserOutlined from "@ant-design/icons/UserOutlined";
import { UserType } from "@staticdeploy/core";
import Form from "antd/lib/form";
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
            <Form.Item
                label={this.props.label}
                wrapperCol={{ span: 24 }}
                className="c-UserTypeField"
            >
                <Select
                    value={this.props.input.value}
                    onChange={this.props.input.onChange}
                    onBlur={() =>
                        this.props.input.onBlur(this.props.input.value)
                    }
                    disabled={this.props.disabled}
                >
                    <Select.Option value={UserType.Human}>
                        <UserOutlined />
                        <span className="c-UserTypeField-option-name">
                            {upperFirst(UserType.Human)}
                        </span>
                    </Select.Option>
                    <Select.Option value={UserType.Machine}>
                        <RobotOutlined />
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
