import { IApp, IAppsStorage, IConfiguration } from "@staticdeploy/core";
import { Knex } from "knex";

import convertErrors from "./common/convertErrors";
import tables from "./common/tables";

@convertErrors
export default class AppsStorage implements IAppsStorage {
    constructor(private knex: Knex) {}

    async findOne(id: string): Promise<IApp | null> {
        const [app = null] = await this.knex(tables.apps).where({ id });
        return app;
    }

    async findOneByName(name: string): Promise<IApp | null> {
        const [app = null] = await this.knex(tables.apps).where({ name });
        return app;
    }

    async findMany(): Promise<IApp[]> {
        const apps = await this.knex(tables.apps);
        return apps;
    }

    async oneExistsWithId(id: string): Promise<boolean> {
        const [app = null] = await this.knex(tables.apps)
            .select("id")
            .where({ id });
        return app !== null;
    }

    async oneExistsWithName(name: string): Promise<boolean> {
        const [app = null] = await this.knex(tables.apps)
            .select("id")
            .where({ name });
        return app !== null;
    }

    async createOne(toBeCreatedApp: {
        id: string;
        name: string;
        defaultConfiguration: IConfiguration;
        createdAt: Date;
        updatedAt: Date;
    }): Promise<IApp> {
        const [createdApp] = await this.knex(tables.apps)
            .insert(toBeCreatedApp)
            .returning("*");
        return createdApp;
    }

    async updateOne(
        id: string,
        patch: {
            defaultConfiguration?: IConfiguration;
            updatedAt: Date;
        }
    ): Promise<IApp> {
        const [updatedApp] = await this.knex(tables.apps)
            .where({ id })
            .update(patch)
            .returning("*");
        return updatedApp;
    }

    async deleteOne(id: string): Promise<void> {
        await this.knex(tables.apps).where({ id }).delete();
    }
}
