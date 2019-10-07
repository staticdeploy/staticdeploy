import { AppNotFoundError } from "../common/errors";
import Usecase from "../common/Usecase";
import { IApp } from "../entities/App";
import {
    IConfiguration,
    validateConfiguration
} from "../entities/Configuration";
import { Operation } from "../entities/OperationLog";

export default class UpdateApp extends Usecase {
    async exec(
        id: string,
        patch: {
            defaultConfiguration?: IConfiguration;
        }
    ): Promise<IApp> {
        // Auth check
        await this.authorizer.ensureCanUpdateApp(id);

        // Validate defaultConfiguration
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

        // Update the app
        const updatedApp = await this.storages.apps.updateOne(id, {
            defaultConfiguration: patch.defaultConfiguration,
            updatedAt: new Date()
        });

        // Log the operation
        await this.operationLogger.logOperation(Operation.UpdateApp, {
            oldApp: existingApp,
            newApp: updatedApp
        });

        return updatedApp;
    }
}
