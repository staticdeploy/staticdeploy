import {
    IConfiguration,
    IEntrypoint,
    IEntrypointsStorage,
} from "@staticdeploy/core";
import { defaults, filter, find } from "lodash";

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

    async findManyByUrlMatcherHostname(
        urlMatcherHostname: string
    ): Promise<IEntrypoint[]> {
        return filter(this.entrypoints, (entrypoint) =>
            entrypoint.urlMatcher.startsWith(urlMatcherHostname)
        );
    }

    async oneExistsWithUrlMatcher(urlMatcher: string): Promise<boolean> {
        return !!find(this.entrypoints, { urlMatcher });
    }

    async anyExistsWithAppId(appId: string): Promise<boolean> {
        return !!find(this.entrypoints, { appId });
    }

    async anyExistsWithBundleIdIn(bundleIds: string[]): Promise<boolean> {
        return !!find(
            this.entrypoints,
            (e) => e.bundleId !== null && bundleIds.includes(e.bundleId)
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
            bundleId?: string | null;
            redirectTo?: string | null;
            configuration?: IConfiguration | null;
            updatedAt: Date;
        }
    ): Promise<IEntrypoint> {
        this.entrypoints[id] = {
            ...this.entrypoints[id],
            ...defaults(patch, this.entrypoints[id]),
        };
        return this.entrypoints[id];
    }

    async deleteOne(id: string): Promise<void> {
        delete this.entrypoints[id];
    }
}
