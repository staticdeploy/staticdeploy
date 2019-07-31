import {
    AppNotFoundError,
    BundleNotFoundError,
    ConflictingEntrypointError
} from "../common/errors";
import generateId from "../common/generateId";
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

export default class CreateEntrypoint extends Usecase {
    async exec(partial: {
        appId: string;
        bundleId?: string | null;
        redirectTo?: string | null;
        urlMatcher: string;
        configuration?: IConfiguration | null;
    }): Promise<IEntrypoint> {
        // Auth check
        this.authorizer.ensureCanCreateEntrypoint(
            partial.appId,
            partial.urlMatcher
        );

        // Validate the urlMatcher and the configuration
        validateEntrypointUrlMatcher(partial.urlMatcher);
        if (partial.configuration) {
            validateConfiguration(partial.configuration, "configuration");
        }

        // Ensure the linked app exists
        const linkedApp = await this.storages.apps.findOne(partial.appId);
        if (!linkedApp) {
            throw new AppNotFoundError(partial.appId, "id");
        }

        // Ensure the linked bundle exists
        if (partial.bundleId) {
            const linkedBundle = await this.storages.bundles.findOne(
                partial.bundleId
            );
            if (!linkedBundle) {
                throw new BundleNotFoundError(partial.bundleId, "id");
            }
        }

        // Ensure no entrypoint with the same urlMatcher exists
        const conflictingEntrypoint = await this.storages.entrypoints.findOneByUrlMatcher(
            partial.urlMatcher
        );
        if (conflictingEntrypoint) {
            throw new ConflictingEntrypointError(partial.urlMatcher);
        }

        // Create the entrypoint
        const now = new Date();
        const createdEntrypoint = await this.storages.entrypoints.createOne({
            id: generateId(),
            appId: partial.appId,
            bundleId: partial.bundleId || null,
            redirectTo: partial.redirectTo || null,
            urlMatcher: partial.urlMatcher,
            configuration: partial.configuration || null,
            createdAt: now,
            updatedAt: now
        });

        // Log the operation
        await this.operationLogger.logOperation(Operation.createEntrypoint, {
            createdEntrypoint
        });

        return createdEntrypoint;
    }
}
