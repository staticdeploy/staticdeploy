import { ConflictingAppError } from "../common/errors";
import generateId from "../common/generateId";
import Usecase from "../common/Usecase";
import { IApp, validateAppName } from "../entities/App";
import {
    IConfiguration,
    validateConfiguration
} from "../entities/Configuration";
import { Operation } from "../entities/OperationLog";

export default class CreateApp extends Usecase {
    async exec(partial: {
        name: string;
        defaultConfiguration?: IConfiguration;
    }): Promise<IApp> {
        // Auth check
        this.authorizer.ensureCanCreateApp();

        // Validate name and defaultConfiguration
        validateAppName(partial.name);
        if (partial.defaultConfiguration) {
            validateConfiguration(
                partial.defaultConfiguration,
                "defaultConfiguration"
            );
        }

        // Ensure no app with the same name exists
        const conflictingApp = await this.storages.apps.findOneByName(
            partial.name
        );
        if (conflictingApp) {
            throw new ConflictingAppError(partial.name);
        }

        // Create the app
        const now = new Date();
        const createdApp = await this.storages.apps.createOne({
            id: generateId(),
            name: partial.name,
            defaultConfiguration: partial.defaultConfiguration || {},
            createdAt: now,
            updatedAt: now
        });

        // Log the operation
        await this.operationLogger.logOperation(Operation.createApp, {
            createdApp
        });

        return createdApp;
    }
}
