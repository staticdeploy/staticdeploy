import {
    IUser,
    IUsersStorage,
    IUserWithGroups,
    IUserWithRoles,
    UserType
} from "@staticdeploy/core";
import Knex from "knex";
import { flatMap, omit } from "lodash";

import convertErrors from "./common/convertErrors";
import tables from "./common/tables";

@convertErrors
export default class UsersStorage implements IUsersStorage {
    private static omitGroupsIds<T>(
        objectWithGroupsIds: T & { groupsIds?: string[] }
    ): Omit<T, "groupsIds"> {
        return omit(objectWithGroupsIds, "groupsIds");
    }

    constructor(private knex: Knex) {}

    async findOne(id: string): Promise<IUser | null> {
        const [user = null] = await this.knex(tables.users).where({ id });
        return user;
    }

    async findOneWithGroups(id: string): Promise<IUserWithGroups | null> {
        const [user] = await this.knex(tables.users).where({ id });
        if (!user) {
            return null;
        }
        const groups = await this.knex(tables.usersAndGroups)
            .where({ userId: id })
            .leftOuterJoin(
                tables.groups,
                `${tables.usersAndGroups}.groupId`,
                `${tables.groups}.id`
            )
            .select(["id", "name", "roles", "createdAt", "updatedAt"]);
        return { ...user, groups };
    }
    async findOneWithRolesByIdpAndIdpId(
        idp: string,
        idpId: string
    ): Promise<IUserWithRoles | null> {
        const [user] = await this.knex(tables.users).where({
            idp,
            idpId
        });
        if (!user) {
            return null;
        }
        const groupsRoles = await this.knex(tables.usersAndGroups)
            .where({ userId: user.id })
            .leftOuterJoin(
                tables.groups,
                `${tables.usersAndGroups}.groupId`,
                `${tables.groups}.id`
            )
            .select(["roles"]);
        return { ...user, roles: flatMap(groupsRoles, "roles") };
    }

    async findMany(): Promise<IUser[]> {
        const users = await this.knex(tables.users);
        return users;
    }

    async oneExistsWithIdpAndIdpId(
        idp: string,
        idpId: string
    ): Promise<boolean> {
        const [user = null] = await this.knex(tables.users)
            .select("id")
            .where({ idp, idpId });
        return user !== null;
    }

    async anyExistsWithGroup(groupId: string): Promise<boolean> {
        const [userAndGroup = null] = await this.knex(tables.usersAndGroups)
            .where({ groupId })
            .limit(1);
        return userAndGroup !== null;
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
        const [createdUser] = await this.knex(tables.users)
            .insert(UsersStorage.omitGroupsIds(toBeCreatedUser))
            .returning("*");
        await this.knex(tables.usersAndGroups).insert(
            toBeCreatedUser.groupsIds.map(groupId => ({
                userId: toBeCreatedUser.id,
                groupId: groupId
            }))
        );
        return createdUser;
    }

    async updateOne(
        id: string,
        patch: {
            name?: string;
            groupsIds?: string[];
            updatedAt: Date;
        }
    ): Promise<IUser> {
        const [updatedUser] = await this.knex(tables.users)
            .where({ id })
            .update(UsersStorage.omitGroupsIds(patch))
            .returning("*");
        if (patch.groupsIds) {
            await this.knex(tables.usersAndGroups).insert(
                patch.groupsIds.map(groupId => ({
                    userId: id,
                    groupId: groupId
                }))
            );
            await this.knex(tables.usersAndGroups)
                .where({ userId: id })
                .whereNotIn("groupId", patch.groupsIds)
                .delete();
        }
        return updatedUser;
    }

    async deleteOne(id: string): Promise<void> {
        await this.knex(tables.users)
            .where({ id })
            .delete();
    }
}
