import { AppHasEntrypointsError, AppNotFoundError } from "../common/errors";
import Usecase from "../common/Usecase";
import { Operation } from "../entities/OperationLog";

export default class DeleteApp extends Usecase {
    async exec(id: string): Promise<void> {
        const toBeDeletedApp = await this.storages.apps.findOne(id);

        // Ensure the app exists
        if (!toBeDeletedApp) {
            throw new AppNotFoundError(id, "id");
        }

        // Auth check
        await this.authorizer.ensureCanDeleteApp(toBeDeletedApp.name);

        // Ensure the app has no linked entrypoints
        const hasLinkedEntrypoints = await this.storages.entrypoints.anyExistsWithAppId(
            id
        );
        if (hasLinkedEntrypoints) {
            throw new AppHasEntrypointsError(id);
        }

        // Delete the app
        await this.storages.apps.deleteOne(id);

        // Log the operation
        await this.operationLogger.logOperation(Operation.DeleteApp, {
            deletedApp: toBeDeletedApp,
        });
    }
}
