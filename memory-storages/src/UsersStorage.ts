import {
    IGroup,
    IUser,
    IUsersStorage,
    IUserWithGroups,
    IUserWithRoles,
    UserType,
} from "@staticdeploy/core";
import { defaults, find, flatMap, omit, toArray } from "lodash";

import cloneMethodsIO from "./common/cloneMethodsIO";
import convertErrors from "./common/convertErrors";
import { ICollection } from "./common/ICollection";

@cloneMethodsIO
@convertErrors
export default class UsersStorage implements IUsersStorage {
    private static omitGroupsIds(user: IUser & { groupsIds: string[] }): IUser {
        return omit(user, "groupsIds");
    }

    constructor(
        private users: ICollection<IUser & { groupsIds: string[] }>,
        private groups: ICollection<IGroup>
    ) {}

    async findOne(id: string): Promise<IUser | null> {
        const user = this.users[id];
        return user ? UsersStorage.omitGroupsIds(user) : null;
    }

    async findOneWithGroups(id: string): Promise<IUserWithGroups | null> {
        const user = this.users[id];
        return user
            ? {
                  ...UsersStorage.omitGroupsIds(user),
                  groups: user.groupsIds.map((groupId) => this.groups[groupId]),
              }
            : null;
    }

    async findOneWithRolesByIdpAndIdpId(
        idp: string,
        idpId: string
    ): Promise<IUserWithRoles | null> {
        const user = find(this.users, { idp, idpId });
        return user
            ? {
                  ...UsersStorage.omitGroupsIds(user),
                  roles: flatMap(
                      user.groupsIds,
                      (groupId) => this.groups[groupId].roles
                  ),
              }
            : null;
    }

    async findMany(): Promise<IUser[]> {
        return toArray(this.users).map(UsersStorage.omitGroupsIds);
    }

    async oneExistsWithIdpAndIdpId(
        idp: string,
        idpId: string
    ): Promise<boolean> {
        return !!find(this.users, { idp, idpId });
    }

    async anyExistsWithGroup(groupId: string): Promise<boolean> {
        return !!find(this.users, (u) => u.groupsIds.includes(groupId));
    }

    async createOne(toBeCreatedUser: {
        id: string;
        idp: string;
        idpId: string;
        type: UserType;
        name: string;
        groupsIds: string[];
        createdAt: Date;
        updatedAt: Date;
    }): Promise<IUser> {
        this.users[toBeCreatedUser.id] = toBeCreatedUser;
        return UsersStorage.omitGroupsIds(toBeCreatedUser);
    }

    async updateOne(
        id: string,
        patch: {
            name?: string;
            groupsIds?: string[];
            updatedAt: Date;
        }
    ): Promise<IUser> {
        this.users[id] = {
            ...this.users[id],
            ...defaults(patch, this.users[id]),
        };
        return UsersStorage.omitGroupsIds(this.users[id]);
    }

    async deleteOne(id: string): Promise<void> {
        delete this.users[id];
    }
}
