import { IGroup } from "@staticdeploy/core";
import React from "react";

import {
    IConverterForm,
    IInjectedFormProps,
    reduxForm
} from "../../common/formWithValuesConverter";
import GroupsIdsField from "../GroupsIdsField";
import TextField from "../TextField";
import UserTypeField from "../UserTypeField";
import IFormValues from "./IFormValues";
import validate from "./validate";

interface IProps {
    groups: IGroup[];
    isEditForm?: boolean;
}

class UserForm extends React.Component<
    IProps & IInjectedFormProps<IFormValues>
> {
    render() {
        const { groups, handleSubmit, isEditForm } = this.props;
        return (
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Identity provider"
                    name="idp"
                    inlineError={true}
                    disabled={isEditForm}
                />
                <TextField
                    label="User id for the identity provider"
                    name="idpId"
                    inlineError={true}
                    disabled={isEditForm}
                />
                <UserTypeField label="Type" name="type" disabled={isEditForm} />
                <TextField label="Name" name="name" inlineError={true} />
                <GroupsIdsField
                    label="Groups"
                    name="groupsIds"
                    groups={groups}
                />
            </form>
        );
    }
}

export interface IUserFormInstance extends IConverterForm<IFormValues> {}

export default reduxForm<IFormValues, IFormValues, IProps>({
    form: "UserForm",
    validate: validate
})(UserForm);
