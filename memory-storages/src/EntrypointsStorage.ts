import {
    IConfiguration,
    IEntrypoint,
    IEntrypointsStorage
} from "@staticdeploy/core";
import { filter, find, map } from "lodash";

import cloneMethodsIO from "./common/cloneMethodsIO";
import convertErrors from "./common/convertErrors";
import { ICollection } from "./common/ICollection";

@cloneMethodsIO
@convertErrors
export default class EntrypointsStorage implements IEntrypointsStorage {
    constructor(private entrypoints: ICollection<IEntrypoint>) {}

    async findOne(id: string): Promise<IEntrypoint | null> {
        return this.entrypoints[id] || null;
    }

    async findOneByUrlMatcher(urlMatcher: string): Promise<IEntrypoint | null> {
        return find(this.entrypoints, { urlMatcher }) || null;
    }

    async findManyByAppId(appId: string): Promise<IEntrypoint[]> {
        return filter(this.entrypoints, { appId });
    }

    async findManyByBundleId(bundleId: string): Promise<IEntrypoint[]> {
        return filter(this.entrypoints, { bundleId });
    }

    async findManyByBundleIds(bundleIds: string[]): Promise<IEntrypoint[]> {
        return filter(this.entrypoints, entrypoint =>
            entrypoint.bundleId
                ? bundleIds.includes(entrypoint.bundleId)
                : false
        );
    }

    async findManyByUrlMatcherHostname(
        urlMatcherHostname: string
    ): Promise<IEntrypoint[]> {
        return filter(this.entrypoints, entrypoint =>
            entrypoint.urlMatcher.startsWith(urlMatcherHostname)
        );
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
        this.entrypoints[toBeCreatedEntrypoint.id] = toBeCreatedEntrypoint;
        return toBeCreatedEntrypoint;
    }

    async updateOne(
        id: string,
        patch: {
            appId?: string;
            bundleId?: string | null;
            redirectTo?: string | null;
            urlMatcher?: string;
            configuration?: IConfiguration | null;
            updatedAt: Date;
        }
    ): Promise<IEntrypoint> {
        this.entrypoints[id] = {
            ...this.entrypoints[id],
            ...patch
        };
        return this.entrypoints[id];
    }

    async deleteOne(id: string): Promise<void> {
        delete this.entrypoints[id];
    }

    async deleteManyByAppId(appId: string): Promise<void> {
        const toBeRemovedIds = map(filter(this.entrypoints, { appId }), "id");
        for (const id of toBeRemovedIds) {
            delete this.entrypoints[id];
        }
    }
}
