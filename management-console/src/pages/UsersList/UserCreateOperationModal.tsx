import { IGroup, IUser, UserType } from "@staticdeploy/core";
import StaticdeployClient from "@staticdeploy/sdk";
import { History } from "history";
import React from "react";

import emphasizeString from "../../common/emphasizeString";
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
    createUser = (staticdeploy: StaticdeployClient) => {
        if (!this.form.isValid()) {
            this.form.submit();
            throw new Error("Invalid form data");
        }
        const values = this.form!.getValues();
        return staticdeploy.users.create({
            idp: values.idp,
            idpId: values.idpId,
            type: values.type,
            name: values.name,
            groupsIds: values.groupsIds
        });
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
                    initialValues={{
                        idp: "",
                        idpId: "",
                        type: UserType.Human,
                        name: "",
                        groupsIds: []
                    }}
                />
            </OperationModal>
        );
    }
}
