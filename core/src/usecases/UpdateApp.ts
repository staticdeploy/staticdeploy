import { AppNotFoundError } from "../common/functionalErrors";
import Usecase from "../common/Usecase";
import { IApp } from "../entities/App";
import {
    IConfiguration,
    validateConfiguration
} from "../entities/Configuration";
import { Operation } from "../entities/OperationLog";

type Arguments = [
    string,
    {
        defaultConfiguration?: IConfiguration;
    }
];
type ReturnValue = IApp;

export default class UpdateApp extends Usecase<Arguments, ReturnValue> {
    protected async _exec(
        id: Arguments[0],
        patch: Arguments[1]
    ): Promise<ReturnValue> {
        const existingApp = await this.storages.apps.findOne(id);

        // Ensure the app exists
        if (!existingApp) {
            throw new AppNotFoundError(id, "id");
        }

        // Auth check
        this.authorizer.ensureCanUpdateApp(existingApp.name);

        // Validate defaultConfiguration
        if (patch.defaultConfiguration) {
            validateConfiguration(
                patch.defaultConfiguration,
                "defaultConfiguration"
            );
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
