import { IGroup, IUser } from "@staticdeploy/core";
import { History } from "history";
import React from "react";

import emphasizeString from "../../common/emphasizeString";
import staticdeploy from "../../common/staticdeployClient";
import BaseOperationModal from "../../components/OperationModal";
import UserForm, { IUserFormInstance } from "../../components/UserForm";

class OperationModal extends BaseOperationModal<IUser> {}

interface IProps {
    groups: IGroup[];
    history: History;
    trigger: React.ReactNode;
    refetchUsersList: () => void;
}

export default class UserCreateOperationModal extends React.Component<IProps> {
    form!: IUserFormInstance;
    createUser = () => {
        if (!this.form.isValid()) {
            this.form.submit();
            throw new Error("Invalid form data");
        }
        const values = this.form!.getValues();
        return staticdeploy.users.create(values);
    };
    refetchUsersListAndGoToUserDetail = (user: IUser) => {
        this.props.refetchUsersList();
        this.props.history.push(`/users/${user.id}`);
    };
    render() {
        return (
            <OperationModal
                title="Create user"
                operation={this.createUser}
                trigger={this.props.trigger}
                startOperationButtonText="Create"
                onAfterSuccessClose={this.refetchUsersListAndGoToUserDetail}
                successMessage={createdUser => (
                    <span>
                        {"Created user "}
                        {emphasizeString(createdUser.name)}
                        {" with id "}
                        {emphasizeString(createdUser.id)}
                    </span>
                )}
            >
                <UserForm
                    groups={this.props.groups}
                    ref={form => (this.form = form!)}
                />
            </OperationModal>
        );
    }
}
