import { IGroup } from "@staticdeploy/core";
import StaticdeployClient from "@staticdeploy/sdk";
import { History } from "history";
import React from "react";

import emphasizeString from "../../common/emphasizeString";
import BaseOperationModal from "../../components/OperationModal";

class OperationModal extends BaseOperationModal<void> {}

interface IProps {
    group: IGroup;
    history: History;
    trigger: React.ReactNode;
}

export default class GroupDeleteOperationModal extends React.Component<IProps> {
    deleteGroup = (staticdeploy: StaticdeployClient) =>
        staticdeploy.groups.delete(this.props.group.id);
    goToGroupsList = () => this.props.history.push("/groups");
    render() {
        return (
            <OperationModal
                title={
                    <span>
                        {"Delete group "}
                        {emphasizeString(this.props.group.name)}
                    </span>
                }
                operation={this.deleteGroup}
                trigger={this.props.trigger}
                startOperationButtonText="Delete"
                onAfterSuccessClose={this.goToGroupsList}
                successMessage="Group deleted"
            >
                <div>
                    {"Are you sure you want to delete group "}
                    {emphasizeString(this.props.group.name)}
                    {"?"}
                </div>
            </OperationModal>
        );
    }
}
