import { ExternalCacheNotFoundError } from "../common/functionalErrors";
import Usecase from "../common/Usecase";
import { Operation } from "../entities/OperationLog";

type Arguments = [string];
type ReturnValue = void;

export default class DeleteExternalCache extends Usecase<
    Arguments,
    ReturnValue
> {
    protected async _exec(id: Arguments[0]): Promise<ReturnValue> {
        const toBeDeletedExternalCache = await this.storages.externalCaches.findOne(
            id
        );

        // Ensure the externalCache exists
        if (!toBeDeletedExternalCache) {
            throw new ExternalCacheNotFoundError(id);
        }

        // Auth check
        this.authorizer.ensureCanDeleteExternalCache();

        // Delete the externalCache
        await this.storages.externalCaches.deleteOne(id);

        // Log the operation
        await this.operationLogger.logOperation(Operation.DeleteExternalCache, {
            deletedExternalCache: toBeDeletedExternalCache
        });
    }
}
