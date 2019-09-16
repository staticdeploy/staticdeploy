import { IGroup, IUser, IUserWithGroups } from "@staticdeploy/core";
import StaticdeployClient from "@staticdeploy/sdk";
import { History, Location } from "history";
import React from "react";

import emphasizeString from "../../common/emphasizeString";
import BaseOperationModal from "../../components/OperationModal";
import UserForm, { IUserFormInstance } from "../../components/UserForm";

class OperationModal extends BaseOperationModal<IUser> {}

interface IProps {
    groups: IGroup[];
    user: IUserWithGroups;
    history: History;
    location: Location;
    refetchUserDetail: () => void;
    trigger: React.ReactNode;
}

export default class UserEditOperationModal extends React.Component<IProps> {
    form!: IUserFormInstance;
    editUser = (staticdeploy: StaticdeployClient) => {
        if (!this.form.isValid()) {
            this.form.submit();
            throw new Error("Invalid form data");
        }
        const values = this.form!.getValues();
        return staticdeploy.users.update(this.props.user.id, {
            name: values.name,
            groupsIds: values.groupsIds
        });
    };
    refetchUserDetail = () => this.props.refetchUserDetail();
    render() {
        const { groups, trigger, user } = this.props;
        return (
            <OperationModal
                title={
                    <span>
                        {"Edit user "}
                        {emphasizeString(user.name)}
                    </span>
                }
                operation={this.editUser}
                trigger={trigger}
                startOperationButtonText="Save"
                onAfterSuccessClose={this.refetchUserDetail}
                successMessage="User saved"
            >
                <UserForm
                    isEditForm={true}
                    groups={groups}
                    initialValues={{
                        ...user,
                        groupsIds: user.groups.map(group => group.id)
                    }}
                    ref={form => (this.form = form!)}
                />
            </OperationModal>
        );
    }
}
