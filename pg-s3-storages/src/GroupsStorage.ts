import { IGroup, IGroupsStorage } from "@staticdeploy/core";
import Knex from "knex";

import convertErrors from "./common/convertErrors";
import tables from "./common/tables";

@convertErrors
export default class GroupsStorage implements IGroupsStorage {
    constructor(private knex: Knex) {}

    async findOne(id: string): Promise<IGroup | null> {
        const [group = null] = await this.knex(tables.groups).where({ id });
        return group;
    }

    async findOneByName(name: string): Promise<IGroup | null> {
        const [group = null] = await this.knex(tables.groups).where({ name });
        return group;
    }

    async findMany(): Promise<IGroup[]> {
        const groups = await this.knex(tables.groups);
        return groups;
    }

    async oneExistsWithName(name: string): Promise<boolean> {
        const [group = null] = await this.knex(tables.groups)
            .select("id")
            .where({ name });
        return group !== null;
    }

    async allExistWithIds(ids: string[]): Promise<boolean> {
        const groups = await this.knex(tables.groups)
            .select("id")
            .whereIn("id", ids);
        return groups.length === ids.length;
    }

    async createOne(toBeCreatedGroup: {
        id: string;
        name: string;
        roles: string[];
        createdAt: Date;
        updatedAt: Date;
    }): Promise<IGroup> {
        const [createdGroup] = await this.knex(tables.groups)
            .insert(toBeCreatedGroup)
            .returning("*");
        return createdGroup;
    }

    async updateOne(
        id: string,
        patch: {
            name?: string;
            roles?: string[];
            updatedAt: Date;
        }
    ): Promise<IGroup> {
        const [updatedGroup] = await this.knex(tables.groups)
            .where({ id })
            .update(patch)
            .returning("*");
        return updatedGroup;
    }

    async deleteOne(id: string): Promise<void> {
        await this.knex(tables.groups).where({ id }).delete();
    }
}
