import { IExternalCacheType } from "@staticdeploy/core";
import Form, { FormItemProps } from "antd/lib/form";
import Select, { SelectProps } from "antd/lib/select";
import React from "react";
import { Field, WrappedFieldProps } from "redux-form";

interface IProps {
    name: string;
    label: FormItemProps["label"];
    placeholder?: SelectProps["placeholder"];
    supportedExternalCacheTypes: IExternalCacheType[];
}

export class WrappedExternalCacheTypeField extends React.Component<
    WrappedFieldProps & IProps
> {
    renderOptions() {
        return this.props.supportedExternalCacheTypes.map(externalCacheType => (
            <Select.Option
                key={externalCacheType.name}
                value={externalCacheType.name}
            >
                {externalCacheType.label}
            </Select.Option>
        ));
    }
    render() {
        const error = this.props.meta.error;
        const displayError = this.props.meta.touched && error;
        return (
            <Form.Item
                label={this.props.label}
                className="c-ExternalCacheTypeField"
                validateStatus={displayError ? "error" : undefined}
                help={displayError ? error : null}
            >
                <Select
                    value={this.props.input.value}
                    onChange={this.props.input.onChange}
                    onBlur={this.props.input.onBlur}
                    // BUG: not currently shown by the ant component
                    placeholder={this.props.placeholder}
                >
                    {this.renderOptions()}
                </Select>
            </Form.Item>
        );
    }
}

export default class ExternalCacheTypeField extends React.Component<IProps> {
    render() {
        return (
            <Field
                name={this.props.name}
                component={WrappedExternalCacheTypeField}
                props={this.props}
            />
        );
    }
}
