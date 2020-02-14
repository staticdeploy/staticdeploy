import { IExternalCache, IExternalCachesStorage } from "@staticdeploy/core";
import { defaults, find, toArray } from "lodash";

import cloneMethodsIO from "./common/cloneMethodsIO";
import { ICollection } from "./common/ICollection";

@cloneMethodsIO
export default class ExternalCachesStorage implements IExternalCachesStorage {
    constructor(private externalCaches: ICollection<IExternalCache>) {}

    async findOne(id: string): Promise<IExternalCache | null> {
        return this.externalCaches[id] || null;
    }

    async findOneByDomain(domain: string): Promise<IExternalCache | null> {
        return find(this.externalCaches, { domain }) || null;
    }

    async findMany(): Promise<IExternalCache[]> {
        return toArray(this.externalCaches);
    }

    async oneExistsWithDomain(domain: string): Promise<boolean> {
        return !!find(this.externalCaches, { domain });
    }

    async createOne(toBeCreatedExternalCache: {
        id: string;
        type: string;
        domain: string;
        configuration: IExternalCache["configuration"];
        createdAt: Date;
        updatedAt: Date;
    }): Promise<IExternalCache> {
        this.externalCaches[
            toBeCreatedExternalCache.id
        ] = toBeCreatedExternalCache;
        return toBeCreatedExternalCache;
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
        this.externalCaches[id] = {
            ...this.externalCaches[id],
            ...defaults(patch, this.externalCaches[id])
        };
        return this.externalCaches[id];
    }

    async deleteOne(id: string): Promise<void> {
        delete this.externalCaches[id];
    }
}
