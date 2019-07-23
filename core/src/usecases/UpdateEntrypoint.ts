import {
    AppNotFoundError,
    BundleNotFoundError,
    ConflictingEntrypointError,
    EntrypointNotFoundError
} from "../common/errors";
import Usecase from "../common/Usecase";
import {
    IConfiguration,
    validateConfiguration
} from "../entities/Configuration";
import {
    IEntrypoint,
    validateEntrypointUrlMatcher
} from "../entities/Entrypoint";
import { Operation } from "../entities/OperationLog";

export default class UpdateEntrypoint extends Usecase {
    async exec(
        id: string,
        patch: {
            appId?: string;
            bundleId?: string | null;
            redirectTo?: string | null;
            urlMatcher?: string;
            configuration?: IConfiguration | null;
        }
    ): Promise<IEntrypoint> {
        // Ensure the request is authenticated
        this.authorizer.ensureAuthenticated();

        // Validate the urlMatcher and the configuration
        if (patch.urlMatcher) {
            validateEntrypointUrlMatcher(patch.urlMatcher);
        }
        if (patch.configuration) {
            validateConfiguration(patch.configuration, "configuration");
        }

        const existingEntrypoint = await this.storages.entrypoints.findOne(id);

        // Ensure the entrypoint exists
        if (!existingEntrypoint) {
            throw new EntrypointNotFoundError(id, "id");
        }

        // Ensure the linked app exists
        if (patch.appId) {
            const linkedApp = await this.storages.apps.findOne(patch.appId);
            if (!linkedApp) {
                throw new AppNotFoundError(patch.appId, "id");
            }
        }

        // Ensure the linked bundle exists
        if (patch.bundleId) {
            const linkedBundle = await this.storages.bundles.findOne(
                patch.bundleId
            );
            if (!linkedBundle) {
                throw new BundleNotFoundError(patch.bundleId, "id");
            }
        }

        // Ensure no entrypoint with the same urlMatcher exists
        if (
            patch.urlMatcher &&
            patch.urlMatcher !== existingEntrypoint.urlMatcher
        ) {
            const conflictingEntrypoint = await this.storages.entrypoints.findOneByUrlMatcher(
                patch.urlMatcher
            );
            if (conflictingEntrypoint) {
                throw new ConflictingEntrypointError(patch.urlMatcher);
            }
        }

        // Update the entrypoint
        const updatedEntrypoint = await this.storages.entrypoints.updateOne(
            id,
            {
                ...patch,
                updatedAt: new Date()
            }
        );

        // Log the operation
        await this.operationLogger.logOperation(Operation.updateEntrypoint, {
            oldEntrypoint: existingEntrypoint,
            newEntrypoint: updatedEntrypoint
        });

        return updatedEntrypoint;
    }
}
