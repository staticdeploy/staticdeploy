import {
    AppHasEntrypointsError,
    AppNotFoundError
} from "../common/functionalErrors";
import Usecase from "../common/Usecase";
import { Operation } from "../entities/OperationLog";

type Arguments = [string];
type ReturnValue = void;

export default class DeleteApp extends Usecase<Arguments, ReturnValue> {
    protected async _exec(id: Arguments[0]): Promise<ReturnValue> {
        const toBeDeletedApp = await this.storages.apps.findOne(id);

        // Ensure the app exists
        if (!toBeDeletedApp) {
            throw new AppNotFoundError(id, "id");
        }

        // Auth check
        this.authorizer.ensureCanDeleteApp(toBeDeletedApp.name);

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
            deletedApp: toBeDeletedApp
        });
    }
}
