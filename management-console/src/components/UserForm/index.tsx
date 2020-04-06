import { IGroup, UserType } from "@staticdeploy/core";
import React from "react";
import { InjectedFormProps } from "redux-form";

import {
    IConverterForm,
    reduxForm,
} from "../../common/formWithValuesConverter";
import GroupsIdsField from "../GroupsIdsField";
import TextField from "../TextField";
import UserTypeField from "../UserTypeField";
import { IExternalFormValues, IInternalFormValues } from "./IFormValues";
import validate from "./validate";

interface IProps {
    groups: IGroup[];
    isEditForm?: boolean;
}

class UserForm extends React.Component<
    IProps & InjectedFormProps<IInternalFormValues>
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

export interface IUserFormInstance
    extends IConverterForm<IExternalFormValues> {}

export default reduxForm<IExternalFormValues, IInternalFormValues, IProps>({
    form: "UserForm",
    validate: validate,
    toInternal: (initialValues = {}) => ({
        idp: initialValues.idp || "",
        idpId: initialValues.idpId || "",
        type: initialValues.type || UserType.Human,
        name: initialValues.name || "",
        groupsIds: initialValues.groupsIds || [],
    }),
    toExternal: (values) => ({
        idp: values.idp,
        idpId: values.idpId,
        type: values.type,
        name: values.name,
        groupsIds: values.groupsIds,
    }),
})(UserForm);
