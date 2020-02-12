import { EntrypointNotFoundError } from "../common/functionalErrors";
import Usecase from "../common/Usecase";
import { Operation } from "../entities/OperationLog";

type Arguments = [string];
type ReturnValue = void;

export default class DeleteEntrypoint extends Usecase<Arguments, ReturnValue> {
    protected async _exec(id: Arguments[0]): Promise<ReturnValue> {
        const toBeDeletedEntrypoint = await this.storages.entrypoints.findOne(
            id
        );

        // Ensure the entrypoint exists
        if (!toBeDeletedEntrypoint) {
            throw new EntrypointNotFoundError(id, "id");
        }

        // Auth check
        this.authorizer.ensureCanDeleteEntrypoint(
            toBeDeletedEntrypoint.urlMatcher
        );

        // Delete the entrypoint
        await this.storages.entrypoints.deleteOne(id);

        // Log the operation
        await this.operationLogger.logOperation(Operation.DeleteEntrypoint, {
            deletedEntrypoint: toBeDeletedEntrypoint
        });
    }
}
