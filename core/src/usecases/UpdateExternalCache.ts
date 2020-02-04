import {
    ConflictingExternalCacheError,
    ExternalCacheNotFoundError
} from "../common/errors";
import Usecase from "../common/Usecase";
import {
    IExternalCache,
    validateExternalCacheConfiguration,
    validateExternalCacheDomain
} from "../entities/ExternalCache";
import { Operation } from "../entities/OperationLog";

export default class UpdateExternalCache extends Usecase {
    async exec(
        id: string,
        patch: {
            domain?: string;
            type?: string;
            configuration?: IExternalCache["configuration"];
        }
    ): Promise<IExternalCache> {
        const existingExternalCache = await this.storages.externalCaches.findOne(
            id
        );

        // Ensure the externalCache exists
        if (!existingExternalCache) {
            throw new ExternalCacheNotFoundError(id);
        }

        // Auth check
        await this.authorizer.ensureCanUpdateExternalCache();

        // Validate domain and configuration
        if (patch.domain) {
            validateExternalCacheDomain(patch.domain);
        }
        if (patch.configuration) {
            validateExternalCacheConfiguration(patch.configuration);
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
