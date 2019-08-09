import { IUser } from "@staticdeploy/core";
import { History } from "history";
import React from "react";

import emphasizeString from "../../common/emphasizeString";
import staticdeploy from "../../common/staticdeployClient";
import BaseOperationModal from "../../components/OperationModal";

class OperationModal extends BaseOperationModal<void> {}

interface IProps {
    user: IUser;
    history: History;
    trigger: React.ReactNode;
}

export default class UserDeleteOperationModal extends React.Component<IProps> {
    deleteUser = () => staticdeploy.users.delete(this.props.user.id);
    goToUsersList = () => this.props.history.push("/users");
    render() {
        return (
            <OperationModal
                title={
                    <span>
                        {"Delete user "}
                        {emphasizeString(this.props.user.name)}
                    </span>
                }
                operation={this.deleteUser}
                trigger={this.props.trigger}
                startOperationButtonText="Delete"
                onAfterSuccessClose={this.goToUsersList}
                successMessage="User deleted"
            >
                <div>
                    {"Are you sure you want to delete user "}
                    {emphasizeString(this.props.user.name)}
                    {"?"}
                </div>
            </OperationModal>
        );
    }
}
