import { IApp, IAppsStorage, IConfiguration } from "@staticdeploy/core";
import { defaults, find, toArray } from "lodash";

import cloneMethodsIO from "./common/cloneMethodsIO";
import convertErrors from "./common/convertErrors";
import { ICollection } from "./common/ICollection";

@cloneMethodsIO
@convertErrors
export default class AppsStorage implements IAppsStorage {
    constructor(private apps: ICollection<IApp>) {}

    async findOne(id: string): Promise<IApp | null> {
        return this.apps[id] || null;
    }

    async findOneByName(name: string): Promise<IApp | null> {
        return find(this.apps, { name }) || null;
    }

    async findMany(): Promise<IApp[]> {
        return toArray(this.apps);
    }

    async oneExistsWithId(id: string): Promise<boolean> {
        return !!this.apps[id];
    }

    async oneExistsWithName(name: string): Promise<boolean> {
        return !!find(this.apps, { name });
    }

    async createOne(toBeCreatedApp: {
        id: string;
        name: string;
        defaultConfiguration: IConfiguration;
        createdAt: Date;
        updatedAt: Date;
    }): Promise<IApp> {
        this.apps[toBeCreatedApp.id] = toBeCreatedApp;
        return toBeCreatedApp;
    }

    async updateOne(
        id: string,
        patch: {
            defaultConfiguration?: IConfiguration;
            updatedAt: Date;
        }
    ): Promise<IApp> {
        this.apps[id] = {
            ...this.apps[id],
            ...defaults(patch, this.apps[id]),
        };
        return this.apps[id];
    }

    async deleteOne(id: string): Promise<void> {
        delete this.apps[id];
    }
}
