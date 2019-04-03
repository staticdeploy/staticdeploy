import { IApp, IAppsStorage, IConfiguration } from "@staticdeploy/core";
import Knex from "knex";

import convertErrors from "./common/convertErrors";

export const APPS_TABLE = "apps";

@convertErrors
export default class AppsStorage implements IAppsStorage {
    constructor(private knex: Knex) {}

    async findOne(id: string): Promise<IApp | null> {
        const [app = null] = await this.knex(APPS_TABLE).where({ id });
        return app;
    }

    async findOneByName(name: string): Promise<IApp | null> {
        const [app = null] = await this.knex(APPS_TABLE).where({ name });
        return app;
    }

    async findMany(): Promise<IApp[]> {
        const apps = await this.knex(APPS_TABLE);
        return apps;
    }

    async createOne(toBeCreatedApp: {
        id: string;
        name: string;
        defaultConfiguration: IConfiguration;
        createdAt: Date;
        updatedAt: Date;
    }): Promise<IApp> {
        const [createdApp] = await this.knex(APPS_TABLE)
            .insert(toBeCreatedApp)
            .returning("*");
        return createdApp;
    }

    async updateOne(
        id: string,
        patch: {
            name?: string;
            defaultConfiguration?: IConfiguration;
            updatedAt: Date;
        }
    ): Promise<IApp> {
        const [updatedApp] = await this.knex(APPS_TABLE)
            .where({ id })
            .update(patch)
            .returning("*");
        return updatedApp;
    }

    async deleteOne(id: string): Promise<void> {
        await this.knex(APPS_TABLE)
            .where({ id })
            .delete();
    }
}
