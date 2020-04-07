import {
    IConfiguration,
    IEntrypoint,
    IEntrypointsStorage,
} from "@staticdeploy/core";
import Knex from "knex";

import convertErrors from "./common/convertErrors";
import tables from "./common/tables";

@convertErrors
export default class EntrypointsStorage implements IEntrypointsStorage {
    constructor(private knex: Knex) {}

    async findOne(id: string): Promise<IEntrypoint | null> {
        const [entrypoint = null] = await this.knex(tables.entrypoints).where({
            id,
        });
        return entrypoint;
    }

    async findOneByUrlMatcher(urlMatcher: string): Promise<IEntrypoint | null> {
        const [entrypoint = null] = await this.knex(tables.entrypoints).where({
            urlMatcher,
        });
        return entrypoint;
    }

    async findManyByAppId(appId: string): Promise<IEntrypoint[]> {
        const entrypoints = await this.knex(tables.entrypoints).where({
            appId,
        });
        return entrypoints;
    }

    async findManyByUrlMatcherHostname(
        urlMatcherHostname: string
    ): Promise<IEntrypoint[]> {
        const entrypoints = await this.knex(tables.entrypoints).where(
            "urlMatcher",
            "like",
            `${urlMatcherHostname}%`
        );
        return entrypoints;
    }

    async oneExistsWithUrlMatcher(urlMatcher: string): Promise<boolean> {
        const [entrypoint = null] = await this.knex(tables.entrypoints)
            .select("id")
            .where({ urlMatcher });
        return entrypoint !== null;
    }

    async anyExistsWithAppId(appId: string): Promise<boolean> {
        const [entrypoint = null] = await this.knex(tables.entrypoints)
            .select("id")
            .where({ appId })
            .limit(1);
        return entrypoint !== null;
    }

    async anyExistsWithBundleIdIn(bundleIds: string[]): Promise<boolean> {
        const [entrypoint = null] = await this.knex(tables.entrypoints)
            .select("id")
            .whereIn("bundleId", bundleIds)
            .limit(1);
        return entrypoint !== null;
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
        const [createdApp] = await this.knex(tables.entrypoints)
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
        const [updatedApp] = await this.knex(tables.entrypoints)
            .where({ id })
            .update(patch)
            .returning("*");
        return updatedApp;
    }

    async deleteOne(id: string): Promise<void> {
        await this.knex(tables.entrypoints).where({ id }).delete();
    }
}
