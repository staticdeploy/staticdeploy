import { IGroup } from "./Group";

export interface IIdpUser {
    // Id of the user for the identity provider
    id: string;
    // Identity provider that provides the user
    idp: string;
}

export enum UserType {
    Human = "human",
    Machine = "machine"
}

export interface IUser {
    id: string;
    // Identity provider that provides the user
    idp: string;
    // Id of the user for the identity provider
    idpId: string;
    type: UserType;
    name: string;
    groupsIds: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserWithRoles extends IUser {
    roles: string[];
}

export interface IUserWithGroups extends IUser {
    groups: IGroup[];
}
