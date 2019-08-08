import { IGroup } from "@staticdeploy/core";
import { History } from "history";
import React from "react";

import emphasizeString from "../../common/emphasizeString";
import staticdeploy from "../../common/staticdeployClient";
import GroupForm, { IGroupFormInstance } from "../../components/GroupForm";
import BaseOperationModal from "../../components/OperationModal";

class OperationModal extends BaseOperationModal<IGroup> {}

interface IProps {
    history: History;
    trigger: React.ReactNode;
    refetchGroupsList: () => void;
}

export default class GroupCreateOperationModal extends React.Component<IProps> {
    form!: IGroupFormInstance;
    createGroup = () => {
        if (!this.form.isValid()) {
            this.form.submit();
            throw new Error("Invalid form data");
        }
        const values = this.form!.getValues();
        return staticdeploy.groups.create(values);
    };
    refetchGroupsListAndGoToGroupDetail = (group: IGroup) => {
        this.props.refetchGroupsList();
        this.props.history.push(`/groups/${group.id}`);
    };
    render() {
        return (
            <OperationModal
                title="Create group"
                operation={this.createGroup}
                trigger={this.props.trigger}
                startOperationButtonText="Create"
                onAfterSuccessClose={this.refetchGroupsListAndGoToGroupDetail}
                successMessage={createdGroup => (
                    <span>
                        {"Created group "}
                        {emphasizeString(createdGroup.name)}
                        {" with id "}
                        {emphasizeString(createdGroup.id)}
                    </span>
                )}
            >
                <GroupForm ref={form => (this.form = form!)} />
            </OperationModal>
        );
    }
}
