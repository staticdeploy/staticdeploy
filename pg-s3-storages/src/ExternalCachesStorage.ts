import { IExternalCache, IExternalCachesStorage } from "@staticdeploy/core";
import Knex from "knex";

import tables from "./common/tables";

export default class ExternalCachesStorage implements IExternalCachesStorage {
    constructor(private knex: Knex) {}

    async findOne(id: string): Promise<IExternalCache | null> {
        const [externalCache = null] = await this.knex(
            tables.externalCaches
        ).where({ id });
        return externalCache;
    }

    async findOneByDomain(domain: string): Promise<IExternalCache | null> {
        const [externalCache = null] = await this.knex(
            tables.externalCaches
        ).where({ domain });
        return externalCache;
    }

    async findMany(): Promise<IExternalCache[]> {
        const externalCaches = await this.knex(tables.externalCaches);
        return externalCaches;
    }

    async oneExistsWithDomain(domain: string): Promise<boolean> {
        const [externalCache = null] = await this.knex(tables.externalCaches)
            .select("id")
            .where({ domain });
        return externalCache !== null;
    }

    async createOne(toBeCreatedExternalCache: {
        id: string;
        type: string;
        domain: string;
        configuration: IExternalCache["configuration"];
        createdAt: Date;
        updatedAt: Date;
    }): Promise<IExternalCache> {
        const [createdExternalCache] = await this.knex(tables.externalCaches)
            .insert(toBeCreatedExternalCache)
            .returning("*");
        return createdExternalCache;
    }

    async updateOne(
        id: string,
        patch: {
            type?: string;
            domain?: string;
            configuration?: IExternalCache["configuration"];
            updatedAt: Date;
        }
    ): Promise<IExternalCache> {
        const [updatedExternalCache] = await this.knex(tables.externalCaches)
            .where({ id })
            .update(patch)
            .returning("*");
        return updatedExternalCache;
    }

    async deleteOne(id: string): Promise<void> {
        await this.knex(tables.externalCaches)
            .where({ id })
            .delete();
    }
}
