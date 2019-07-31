import { AppNotFoundError, ConflictingAppError } from "../common/errors";
import Usecase from "../common/Usecase";
import { IApp, validateAppName } from "../entities/App";
import {
    IConfiguration,
    validateConfiguration
} from "../entities/Configuration";
import { Operation } from "../entities/OperationLog";

export default class UpdateApp extends Usecase {
    async exec(
        id: string,
        patch: {
            name?: string;
            defaultConfiguration?: IConfiguration;
        }
    ): Promise<IApp> {
        // Auth check
        this.authorizer.ensureCanUpdateApp(id);

        // Validate name and defaultConfiguration
        if (patch.name) {
            validateAppName(patch.name);
        }
        if (patch.defaultConfiguration) {
            validateConfiguration(
                patch.defaultConfiguration,
                "defaultConfiguration"
            );
        }

        const existingApp = await this.storages.apps.findOne(id);

        // Ensure the app exists
        if (!existingApp) {
            throw new AppNotFoundError(id, "id");
        }

        // Ensure no app with the same name exists
        if (patch.name && patch.name !== existingApp.name) {
            const conflictingApp = await this.storages.apps.findOneByName(
                patch.name
            );
            if (conflictingApp) {
                throw new ConflictingAppError(patch.name);
            }
        }

        // Update the app
        const updatedApp = await this.storages.apps.updateOne(id, {
            name: patch.name,
            defaultConfiguration: patch.defaultConfiguration,
            updatedAt: new Date()
        });

        // Log the operation
        await this.operationLogger.logOperation(Operation.updateApp, {
            oldApp: existingApp,
            newApp: updatedApp
        });

        return updatedApp;
    }
}
