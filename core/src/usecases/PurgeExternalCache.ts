import { find } from "lodash";

import {
    ExternalCacheNotFoundError,
    ExternalCacheTypeNotSupportedError
} from "../common/functionalErrors";
import Usecase from "../common/Usecase";
import { Operation } from "../entities/OperationLog";

type Arguments = [string, string[]];
type ReturnValue = void;

export default class PurgeExternalCache extends Usecase<
    Arguments,
    ReturnValue
> {
    protected async _exec(
        id: Arguments[0],
        paths: Arguments[1]
    ): Promise<ReturnValue> {
        this.authorizer.ensureCanPurgeExternalCache();

        const externalCache = await this.storages.externalCaches.findOne(id);

        if (!externalCache) {
            throw new ExternalCacheNotFoundError(id);
        }

        const externalCacheService = find(this.externalCacheServices, [
            "externalCacheType.name",
            externalCache.type
        ]);

        if (!externalCacheService) {
            throw new ExternalCacheTypeNotSupportedError(externalCache.type);
        }

        await externalCacheService.purge(paths, externalCache.configuration);

        await this.operationLogger.logOperation(Operation.PurgeExternalCache, {
            domain: externalCache.domain,
            type: externalCache.type,
            paths: paths
        });
    }
}
