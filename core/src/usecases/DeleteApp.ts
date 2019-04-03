import { AppNotFoundError } from "../common/errors";
import Usecase from "../common/Usecase";
import { Operation } from "../entities/OperationLog";

export default class DeleteApp extends Usecase {
    async exec(id: string): Promise<void> {
        // Ensure the request is authenticated
        this.authorizer.ensureAuthenticated();

        const toBeDeletedApp = await this.storages.apps.findOne(id);
        const toBeDeletedEntrypoints = await this.storages.entrypoints.findManyByAppId(
            id
        );

        // Ensure the app exists
        if (!toBeDeletedApp) {
            throw new AppNotFoundError(id, "id");
        }

        // Delete linked entrypoints
        await this.storages.entrypoints.deleteManyByAppId(id);

        // Delete the app
        await this.storages.apps.deleteOne(id);

        // Log the operation
        await this.operationLogger.logOperation(Operation.deleteApp, {
            deletedApp: toBeDeletedApp,
            deletedEntrypoints: toBeDeletedEntrypoints
        });
    }
}
