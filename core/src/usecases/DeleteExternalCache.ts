import { ExternalCacheNotFoundError } from "../common/errors";
import Usecase from "../common/Usecase";
import { Operation } from "../entities/OperationLog";

export default class DeleteExternalCache extends Usecase {
    async exec(id: string): Promise<void> {
        const toBeDeletedExternalCache = await this.storages.externalCaches.findOne(
            id
        );

        // Ensure the externalCache exists
        if (!toBeDeletedExternalCache) {
            throw new ExternalCacheNotFoundError(id);
        }

        // Auth check
        await this.authorizer.ensureCanDeleteExternalCache();

        // Delete the externalCache
        await this.storages.externalCaches.deleteOne(id);

        // Log the operation
        await this.operationLogger.logOperation(Operation.DeleteExternalCache, {
            deletedExternalCache: toBeDeletedExternalCache
        });
    }
}
