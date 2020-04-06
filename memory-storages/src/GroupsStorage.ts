import { IGroup, IGroupsStorage } from "@staticdeploy/core";
import { defaults, find, toArray } from "lodash";

import cloneMethodsIO from "./common/cloneMethodsIO";
import convertErrors from "./common/convertErrors";
import { ICollection } from "./common/ICollection";

@cloneMethodsIO
@convertErrors
export default class GroupsStorage implements IGroupsStorage {
    constructor(private groups: ICollection<IGroup>) {}

    async findOne(id: string): Promise<IGroup | null> {
        return this.groups[id] || null;
    }

    async findOneByName(name: string): Promise<IGroup | null> {
        return find(this.groups, { name }) || null;
    }

    async findMany(): Promise<IGroup[]> {
        return toArray(this.groups);
    }

    async oneExistsWithName(name: string): Promise<boolean> {
        return !!find(this.groups, { name });
    }

    async allExistWithIds(ids: string[]): Promise<boolean> {
        return ids.every((id) => !!this.groups[id]);
    }

    async createOne(toBeCreatedGroup: {
        id: string;
        name: string;
        roles: string[];
        createdAt: Date;
        updatedAt: Date;
    }): Promise<IGroup> {
        this.groups[toBeCreatedGroup.id] = toBeCreatedGroup;
        return toBeCreatedGroup;
    }

    async updateOne(
        id: string,
        patch: {
            name?: string;
            roles?: string[];
            updatedAt: Date;
        }
    ): Promise<IGroup> {
        this.groups[id] = {
            ...this.groups[id],
            ...defaults(patch, this.groups[id]),
        };
        return this.groups[id];
    }

    async deleteOne(id: string): Promise<void> {
        delete this.groups[id];
    }
}
