import { EntrypointNotFoundError } from "../common/errors";
import Usecase from "../common/Usecase";
import { Operation } from "../entities/OperationLog";

export default class DeleteEntrypoint extends Usecase {
    async exec(id: string): Promise<void> {
        // Ensure the request is authenticated
        this.authorizer.ensureAuthenticated();

        const toBeDeletedEntrypoint = await this.entrypointsStorage.findOne(id);

        // Ensure the entrypoint exists
        if (!toBeDeletedEntrypoint) {
            throw new EntrypointNotFoundError(id, "id");
        }

        // Delete the entrypoint
        await this.entrypointsStorage.deleteOne(id);

        // Log the operation
        await this.operationLogger.logOperation(Operation.deleteEntrypoint, {
            deletedEntrypoint: toBeDeletedEntrypoint
        });
    }
}
