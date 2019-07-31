import {
    IConfiguration,
    IEntrypoint,
    IEntrypointsStorage
} from "@staticdeploy/core";
import Knex from "knex";

import convertErrors from "./common/convertErrors";

export const ENTRYPOINTS_TABLE = "entrypoints";

@convertErrors
export default class EntrypointsStorage implements IEntrypointsStorage {
    constructor(private knex: Knex) {}

    async findOne(id: string): Promise<IEntrypoint | null> {
        const [entrypoint = null] = await this.knex(ENTRYPOINTS_TABLE).where({
            id
        });
        return entrypoint;
    }

    async findOneByUrlMatcher(urlMatcher: string): Promise<IEntrypoint | null> {
        const [entrypoint = null] = await this.knex(ENTRYPOINTS_TABLE).where({
            urlMatcher
        });
        return entrypoint;
    }

    async findManyByAppId(appId: string): Promise<IEntrypoint[]> {
        const entrypoints = await this.knex(ENTRYPOINTS_TABLE).where({ appId });
        return entrypoints;
    }

    async findManyByBundleId(bundleId: string): Promise<IEntrypoint[]> {
        const entrypoints = await this.knex(ENTRYPOINTS_TABLE).where({
            bundleId
        });
        return entrypoints;
    }

    async findManyByBundleIds(bundleIds: string[]): Promise<IEntrypoint[]> {
        const entrypoints = await this.knex(ENTRYPOINTS_TABLE).whereIn(
            "bundleId",
            bundleIds
        );
        return entrypoints;
    }

    async findManyByUrlMatcherHostname(
        urlMatcherHostname: string
    ): Promise<IEntrypoint[]> {
        const entrypoints = await this.knex(ENTRYPOINTS_TABLE).where(
            "urlMatcher",
            "like",
            `${urlMatcherHostname}%`
        );
        return entrypoints;
    }

    async createOne(toBeCreatedEntrypoint: {
        id: string;
        appId: string;
        bundleId: string | null;
        redirectTo: string | null;
        urlMatcher: string;
        configuration: IConfiguration | null;
        createdAt: Date;
        updatedAt: Date;
    }): Promise<IEntrypoint> {
        const [createdApp] = await this.knex(ENTRYPOINTS_TABLE)
            .insert(toBeCreatedEntrypoint)
            .returning("*");
        return createdApp;
    }

    async updateOne(
        id: string,
        patch: {
            bundleId?: string | null;
            redirectTo?: string | null;
            configuration?: IConfiguration | null;
            updatedAt: Date;
        }
    ): Promise<IEntrypoint> {
        const [updatedApp] = await this.knex(ENTRYPOINTS_TABLE)
            .where({ id })
            .update(patch)
            .returning("*");
        return updatedApp;
    }

    async deleteOne(id: string): Promise<void> {
        await this.knex(ENTRYPOINTS_TABLE)
            .where({ id })
            .delete();
    }
}
