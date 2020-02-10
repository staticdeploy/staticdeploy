import { ConflictingExternalCacheError } from "../common/errors";
import generateId from "../common/generateId";
import Usecase from "../common/Usecase";
import {
    getMatchingExternalCacheType,
    IExternalCache,
    validateExternalCacheConfiguration,
    validateExternalCacheDomain,
    validateExternalCacheType
} from "../entities/ExternalCache";
import { Operation } from "../entities/OperationLog";

export default class CreateExternalCache extends Usecase {
    async exec(partial: {
        domain: string;
        type: string;
        configuration: IExternalCache["configuration"];
    }): Promise<IExternalCache> {
        // Auth check
        await this.authorizer.ensureCanCreateExternalCache();

        // Validate input properties
        const supportedExternalCacheTypes = this.externalCacheService.getSupportedExternalCacheTypes();
        validateExternalCacheType(partial.type, supportedExternalCacheTypes);
        validateExternalCacheDomain(partial.domain);
        validateExternalCacheConfiguration(
            partial.configuration,
            getMatchingExternalCacheType(
                supportedExternalCacheTypes,
                partial.type
            )!
        );

        // Ensure no externalCache with the same domain exists
        const conflictingExternalCacheExists = await this.storages.externalCaches.oneExistsWithDomain(
            partial.domain
        );
        if (conflictingExternalCacheExists) {
            throw new ConflictingExternalCacheError(partial.domain);
        }

        // Create the externalCache
        const now = new Date();
        const createdExternalCache = await this.storages.externalCaches.createOne(
            {
                id: generateId(),
                domain: partial.domain,
                type: partial.type,
                configuration: partial.configuration,
                createdAt: now,
                updatedAt: now
            }
        );

        // Log the operation
        await this.operationLogger.logOperation(Operation.CreateExternalCache, {
            createdExternalCache
        });

        return createdExternalCache;
    }
}
