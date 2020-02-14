import {
    ConflictingExternalCacheError,
    ExternalCacheNotFoundError
} from "../common/functionalErrors";
import getSupportedExternalCacheTypes from "../common/getSupportedExternalCacheTypes";
import Usecase from "../common/Usecase";
import {
    getMatchingExternalCacheType,
    IExternalCache,
    validateExternalCacheConfiguration,
    validateExternalCacheDomain,
    validateExternalCacheType
} from "../entities/ExternalCache";
import { Operation } from "../entities/OperationLog";

type Arguments = [
    string,
    {
        domain?: string;
        type?: string;
        configuration?: IExternalCache["configuration"];
    }
];
type ReturnValue = IExternalCache;

export default class UpdateExternalCache extends Usecase<
    Arguments,
    ReturnValue
> {
    protected async _exec(
        id: Arguments[0],
        patch: Arguments[1]
    ): Promise<ReturnValue> {
        const existingExternalCache = await this.storages.externalCaches.findOne(
            id
        );

        // Ensure the externalCache exists
        if (!existingExternalCache) {
            throw new ExternalCacheNotFoundError(id);
        }

        // Auth check
        this.authorizer.ensureCanUpdateExternalCache();

        // Validate patch
        const supportedExternalCacheTypes = getSupportedExternalCacheTypes(
            this.externalCacheServices
        );
        const type = patch.type || existingExternalCache.type;
        validateExternalCacheType(type, supportedExternalCacheTypes);
        if (patch.domain) {
            validateExternalCacheDomain(patch.domain);
        }
        if (patch.configuration) {
            validateExternalCacheConfiguration(
                patch.configuration,
                getMatchingExternalCacheType(supportedExternalCacheTypes, type)!
            );
        }

        // Ensure no externalCache with the same domain exists
        if (patch.domain) {
            const conflictingExternalCacheExists = await this.storages.externalCaches.oneExistsWithDomain(
                patch.domain
            );
            if (conflictingExternalCacheExists) {
                throw new ConflictingExternalCacheError(patch.domain);
            }
        }

        // Update the externalCache
        const updatedExternalCache = await this.storages.externalCaches.updateOne(
            id,
            {
                domain: patch.domain,
                type: patch.type,
                configuration: patch.configuration,
                updatedAt: new Date()
            }
        );

        // Log the operation
        await this.operationLogger.logOperation(Operation.UpdateExternalCache, {
            oldExternalCache: existingExternalCache,
            newExternalCache: updatedExternalCache
        });

        return updatedExternalCache;
    }
}
