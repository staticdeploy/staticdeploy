import { QuestionCircleTwoTone } from "@ant-design/icons";
import Form, { FormItemProps } from "antd/lib/form";
import Input, { InputProps } from "antd/lib/input";
import Tooltip from "antd/lib/tooltip";
import classnames from "classnames";
import React from "react";
import { Field, WrappedFieldProps } from "redux-form";

import "./index.css";

interface IProps {
    name: string;
    className?: string;
    inlineError?: boolean;
    label?: FormItemProps["label"];
    addonBefore?: InputProps["addonBefore"];
    disabled?: InputProps["disabled"];
    placeholder?: InputProps["placeholder"];
}

export class WrappedTextField extends React.Component<
    WrappedFieldProps & IProps
> {
    render() {
        const error = this.props.meta.error;
        const displayError = this.props.meta.touched && error;
        const displayNonInlineError = displayError && !this.props.inlineError;
        const displayInlineError = displayError && this.props.inlineError;
        const suffix = displayInlineError ? (
            <Tooltip
                overlayClassName="c-TextFieldErrorTooltip"
                placement="left"
                title={error}
            >
                <QuestionCircleTwoTone
                    // red-6 color
                    twoToneColor="#f5222d"
                />
            </Tooltip>
        ) : (
            // Empty span used to preserve focus when dynamically adding or
            // removing the suffix. See https://ant.design/components/input/#FAQ
            <span />
        );
        return (
            <Form.Item
                label={this.props.label}
                wrapperCol={{ span: 24 }}
                className={classnames("c-TextField", this.props.className)}
                validateStatus={displayError ? "error" : undefined}
                help={displayNonInlineError ? error : undefined}
            >
                <Input
                    value={this.props.input.value}
                    onChange={this.props.input.onChange}
                    onBlur={this.props.input.onBlur}
                    addonBefore={this.props.addonBefore}
                    disabled={this.props.disabled}
                    placeholder={this.props.placeholder}
                    suffix={suffix}
                />
            </Form.Item>
        );
    }
}

export default class TextField extends React.Component<IProps> {
    render() {
        return (
            <Field
                name={this.props.name}
                component={WrappedTextField}
                props={this.props}
            />
        );
    }
}
