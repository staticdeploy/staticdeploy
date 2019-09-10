import { IGroup } from "@staticdeploy/core";
import { History, Location } from "history";
import React from "react";

import emphasizeString from "../../common/emphasizeString";
import staticdeploy from "../../common/staticdeployClient";
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
    editGroup = () => {
        if (!this.form.isValid()) {
            this.form.submit();
            throw new Error("Invalid form data");
        }
        const values = this.form!.getValues();
        return staticdeploy.groups.update(this.props.group.id, values);
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
