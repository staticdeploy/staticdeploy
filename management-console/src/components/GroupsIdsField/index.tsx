import { IGroup } from "@staticdeploy/core";
import Form from "antd/lib/form";
import Select from "antd/lib/select";
import React from "react";
import { Field, WrappedFieldProps } from "redux-form";

import "./index.css";

interface IProps {
    name: string;
    label: string;
    groups: IGroup[];
}

export class WrappedGroupsIdsField extends React.Component<
    WrappedFieldProps & IProps
> {
    renderOptions() {
        return this.props.groups.map(group => (
            <Select.Option value={group.id} key={group.id}>
                {group.name}
            </Select.Option>
        ));
    }
    render() {
        return (
            <Form.Item label={this.props.label}>
                <Select
                    mode="multiple"
                    value={this.props.input.value}
                    onChange={this.props.input.onChange}
                    onBlur={this.props.input.onBlur}
                >
                    {this.renderOptions()}
                </Select>
            </Form.Item>
        );
    }
}

export default class GroupsIdsField extends React.Component<IProps> {
    render() {
        return (
            <Field
                name={this.props.name}
                component={WrappedGroupsIdsField}
                props={this.props}
            />
        );
    }
}
