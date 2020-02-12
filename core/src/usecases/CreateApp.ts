import { ConflictingAppError } from "../common/functionalErrors";
import generateId from "../common/generateId";
import Usecase from "../common/Usecase";
import { IApp, validateAppName } from "../entities/App";
import {
    IConfiguration,
    validateConfiguration
} from "../entities/Configuration";
import { Operation } from "../entities/OperationLog";

type Arguments = [
    {
        name: string;
        defaultConfiguration?: IConfiguration;
    }
];
type ReturnValue = IApp;

export default class CreateApp extends Usecase<Arguments, ReturnValue> {
    protected async _exec(partial: Arguments[0]): Promise<ReturnValue> {
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
        const conflictingAppExists = await this.storages.apps.oneExistsWithName(
            partial.name
        );
        if (conflictingAppExists) {
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
        await this.operationLogger.logOperation(Operation.CreateApp, {
            createdApp
        });

        return createdApp;
    }
}
