import { IGroup } from "@staticdeploy/core";
import StaticdeployClient from "@staticdeploy/sdk";
import { History, Location } from "history";
import React from "react";

import emphasizeString from "../../common/emphasizeString";
import GroupForm, { IGroupFormInstance } from "../../components/GroupForm";
import BaseOperationModal from "../../components/OperationModal";

class OperationModal extends BaseOperationModal<IGroup> {}

interface IProps {
    group: IGroup;
    history: History;
    location: Location;
    refetchGroupDetail: () => void;
    trigger: React.ReactNode;
}

export default class GroupEditOperationModal extends React.Component<IProps> {
    form!: IGroupFormInstance;
    editGroup = (staticdeploy: StaticdeployClient) => {
        if (!this.form.isValid()) {
            this.form.submit();
            throw new Error("Invalid form data");
        }
        const values = this.form!.getValues();
        return staticdeploy.groups.update(this.props.group.id, {
            name: values.name,
            roles: values.roles
        });
    };
    refetchGroupDetail = () => this.props.refetchGroupDetail();
    render() {
        return (
            <OperationModal
                title={
                    <span>
                        {"Edit group "}
                        {emphasizeString(this.props.group.name)}
                    </span>
                }
                operation={this.editGroup}
                trigger={this.props.trigger}
                startOperationButtonText="Save"
                onAfterSuccessClose={this.refetchGroupDetail}
                successMessage="Group saved"
            >
                <GroupForm
                    initialValues={this.props.group}
                    ref={form => (this.form = form!)}
                />
            </OperationModal>
        );
    }
}
