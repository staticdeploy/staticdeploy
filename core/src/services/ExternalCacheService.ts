import { map } from "lodash";

import IExternalCacheService from "../dependencies/IExternalCacheService";
import { IExternalCache, IExternalCacheType } from "../entities/ExternalCache";

export default class ExternalCacheService {
    constructor(private externalCacheServices: IExternalCacheService[]) {}

    getSupportedExternalCacheTypes(): IExternalCacheType[] {
        return map(this.externalCacheServices, "externalCacheType");
    }

    async purgeExternalCache(_externalCache: IExternalCache): Promise<void> {
        // TODO
    }
}
