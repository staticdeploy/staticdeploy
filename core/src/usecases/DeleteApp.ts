import { isEmpty } from "lodash";

import { AppHasEntrypointsError, AppNotFoundError } from "../common/errors";
import Usecase from "../common/Usecase";
import { Operation } from "../entities/OperationLog";

export default class DeleteApp extends Usecase {
    async exec(id: string): Promise<void> {
        // Auth check
        this.authorizer.ensureCanDeleteApp(id);

        const toBeDeletedApp = await this.storages.apps.findOne(id);

        // Ensure the app exists
        if (!toBeDeletedApp) {
            throw new AppNotFoundError(id, "id");
        }

        // Ensure the app has no linked entrypoints
        const linkedEntrypoints = await this.storages.entrypoints.findManyByAppId(
            id
        );
        if (!isEmpty(linkedEntrypoints)) {
            throw new AppHasEntrypointsError(id);
        }

        // Delete the app
        await this.storages.apps.deleteOne(id);

        // Log the operation
        await this.operationLogger.logOperation(Operation.deleteApp, {
            deletedApp: toBeDeletedApp
        });
    }
}
