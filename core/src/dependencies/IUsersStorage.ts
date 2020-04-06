import {
    IUser,
    IUserWithGroups,
    IUserWithRoles,
    UserType,
} from "../entities/User";

export default interface IUsersStorage {
    findOne(id: string): Promise<IUser | null>;
    findOneWithGroups(id: string): Promise<IUserWithGroups | null>;
    findOneWithRolesByIdpAndIdpId(
        idp: string,
        idpId: string
    ): Promise<IUserWithRoles | null>;
    findMany(): Promise<IUser[]>;
    oneExistsWithIdpAndIdpId(idp: string, idpId: string): Promise<boolean>;
    anyExistsWithGroup(groupId: string): Promise<boolean>;
    createOne(user: {
        id: string;
        idp: string;
        idpId: string;
        type: UserType;
        name: string;
        groupsIds: string[];
        createdAt: Date;
        updatedAt: Date;
    }): Promise<IUser>;
    updateOne(
        id: string,
        patch: {
            name?: string;
            groupsIds?: string[];
            updatedAt: Date;
        }
    ): Promise<IUser>;
    deleteOne(id: string): Promise<void>;
}
