import {
    BundleNotFoundError,
    EntrypointMismatchedAppIdError
} from "../common/errors";
import generateId from "../common/generateId";
import Usecase from "../common/Usecase";
import { validateAppName } from "../entities/App";
import { splitNameTagCombination } from "../entities/Bundle";
import { validateEntrypointUrlMatcher } from "../entities/Entrypoint";
import { Operation } from "../entities/OperationLog";

export default class DeployBundle extends Usecase {
    async exec(options: {
        bundleNameTagCombination: string;
        appName: string;
        entrypointUrlMatcher: string;
    }): Promise<void> {
        // Ensure the request is authenticated
        this.authorizer.ensureAuthenticated();

        const {
            bundleNameTagCombination,
            appName,
            entrypointUrlMatcher
        } = options;
        const [bundleName, bundleTag] = splitNameTagCombination(
            bundleNameTagCombination
        );

        // Retrieve the deploy objects
        const [bundle, existingApp, existingEntrypoint] = await Promise.all([
            this.bundlesStorage.findLatestByNameAndTag(bundleName, bundleTag),
            this.appsStorage.findOneByName(appName),
            this.entrypointsStorage.findOneByUrlMatcher(entrypointUrlMatcher)
        ]);

        // Ensure the bundle exists
        if (!bundle) {
            throw new BundleNotFoundError(
                bundleNameTagCombination,
                "name:tag combination"
            );
        }

        // Ensure that, if the entrypoint exists, it links to the specified app
        // (which therefore must exist). Since we only need the entrypoint
        // reference for the deploy, we could ignore the app and deploy to that
        // entrypoint. However, this inconsistency is probably caused by a
        // user's mistake in calling the API, and so we prefer to respond with
        // an error
        if (
            existingEntrypoint &&
            (!existingApp || existingApp.id !== existingEntrypoint.appId)
        ) {
            throw new EntrypointMismatchedAppIdError(
                entrypointUrlMatcher,
                appName
            );
        }

        // Create the app if it doesn't exist
        let app = existingApp;
        if (!app) {
            // Validate the app name
            validateAppName(appName);

            const now = new Date();
            app = await this.appsStorage.createOne({
                id: generateId(),
                name: appName,
                defaultConfiguration: {},
                createdAt: now,
                updatedAt: now
            });

            // Log the operation
            await this.operationLogger.logOperation(Operation.createApp, {
                createdApp: app
            });
        }

        if (!existingEntrypoint) {
            // Validate the entrypoint urlMatcher
            validateEntrypointUrlMatcher(entrypointUrlMatcher);

            // Create the entrypoint if it doesn't exist
            const now = new Date();
            const createdEntrypoint = await this.entrypointsStorage.createOne({
                id: generateId(),
                appId: app.id,
                bundleId: bundle.id,
                redirectTo: null,
                urlMatcher: entrypointUrlMatcher,
                configuration: null,
                createdAt: now,
                updatedAt: now
            });

            // Log the operation
            await this.operationLogger.logOperation(
                Operation.createEntrypoint,
                { createdEntrypoint }
            );
        } else {
            // Otherwise, just update the existing entrypoint to point it to the
            // supplied bundle
            const updatedEntrypoint = await this.entrypointsStorage.updateOne(
                existingEntrypoint.id,
                { bundleId: bundle.id, updatedAt: new Date() }
            );

            // Log the operation
            await this.operationLogger.logOperation(
                Operation.updateEntrypoint,
                {
                    oldEntrypoint: existingEntrypoint,
                    newEntrypoint: updatedEntrypoint
                }
            );
        }
    }
}
