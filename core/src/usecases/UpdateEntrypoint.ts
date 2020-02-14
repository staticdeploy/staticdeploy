import {
    BundleNotFoundError,
    EntrypointNotFoundError
} from "../common/functionalErrors";
import Usecase from "../common/Usecase";
import {
    IConfiguration,
    validateConfiguration
} from "../entities/Configuration";
import { IEntrypoint } from "../entities/Entrypoint";
import { Operation } from "../entities/OperationLog";

type Arguments = [
    string,
    {
        bundleId?: string | null;
        redirectTo?: string | null;
        configuration?: IConfiguration | null;
    }
];
type ReturnValue = IEntrypoint;

export default class UpdateEntrypoint extends Usecase<Arguments, ReturnValue> {
    protected async _exec(
        id: Arguments[0],
        patch: Arguments[1]
    ): Promise<ReturnValue> {
        const existingEntrypoint = await this.storages.entrypoints.findOne(id);

        // Ensure the entrypoint exists
        if (!existingEntrypoint) {
            throw new EntrypointNotFoundError(id, "id");
        }

        // Auth check
        this.authorizer.ensureCanUpdateEntrypoint(
            existingEntrypoint.urlMatcher
        );

        // Validate the configuration
        if (patch.configuration) {
            validateConfiguration(patch.configuration, "configuration");
        }

        // Ensure the linked bundle exists
        if (patch.bundleId) {
            const linkedBundleExists = await this.storages.bundles.oneExistsWithId(
                patch.bundleId
            );
            if (!linkedBundleExists) {
                throw new BundleNotFoundError(patch.bundleId, "id");
            }
        }

        // Update the entrypoint
        const updatedEntrypoint = await this.storages.entrypoints.updateOne(
            id,
            {
                bundleId: patch.bundleId,
                redirectTo: patch.redirectTo,
                configuration: patch.configuration,
                updatedAt: new Date()
            }
        );

        // Log the operation
        await this.operationLogger.logOperation(Operation.UpdateEntrypoint, {
            oldEntrypoint: existingEntrypoint,
            newEntrypoint: updatedEntrypoint
        });

        return updatedEntrypoint;
    }
}
