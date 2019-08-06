import {
    IGroup,
    IUser,
    IUsersStorage,
    IUserWithGroups,
    IUserWithRoles,
    UserType
} from "@staticdeploy/core";
import { defaults, find, flatMap, toArray } from "lodash";

import cloneMethodsIO from "./common/cloneMethodsIO";
import convertErrors from "./common/convertErrors";
import { ICollection } from "./common/ICollection";

@cloneMethodsIO
@convertErrors
export default class UsersStorage implements IUsersStorage {
    constructor(
        private users: ICollection<IUser>,
        private groups: ICollection<IGroup>
    ) {}

    async findOne(id: string): Promise<IUser | null> {
        return this.users[id] || null;
    }

    async findOneWithGroups(id: string): Promise<IUserWithGroups | null> {
        const user = await this.findOne(id);
        if (!user) {
            return null;
        }
        return {
            ...user,
            groups: user.groupsIds.map(groupId => this.groups[groupId])
        };
    }

    async findOneWithRolesByIdpAndIdpId(
        idp: string,
        idpId: string
    ): Promise<IUserWithRoles | null> {
        const user = find(this.users, { idp, idpId }) || null;
        if (!user) {
            return null;
        }
        return {
            ...user,
            roles: flatMap(
                user.groupsIds,
                groupId => this.groups[groupId].roles
            )
        };
    }

    async findMany(): Promise<IUser[]> {
        return toArray(this.users);
    }

    async oneExistsWithIdpAndIdpId(
        idp: string,
        idpId: string
    ): Promise<boolean> {
        const user = find(this.users, { idp, idpId }) || null;
        return user !== null;
    }

    async anyExistsWithGroupId(groupId: string): Promise<boolean> {
        const user =
            find(this.users, u => u.groupsIds.includes(groupId)) || null;
        return user !== null;
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
        return toBeCreatedUser;
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
            ...defaults(patch, this.users[id])
        };
        return this.users[id];
    }

    async deleteOne(id: string): Promise<void> {
        delete this.users[id];
    }
}
