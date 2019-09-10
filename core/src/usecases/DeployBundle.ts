import {
    BundleNotFoundError,
    EntrypointMismatchedAppIdError
} from "../common/errors";
import Usecase from "../common/Usecase";
import { splitNameTagCombination } from "../entities/Bundle";
import CreateApp from "./CreateApp";
import CreateEntrypoint from "./CreateEntrypoint";
import UpdateEntrypoint from "./UpdateEntrypoint";

export default class DeployBundle extends Usecase {
    async exec(options: {
        bundleNameTagCombination: string;
        appName: string;
        entrypointUrlMatcher: string;
    }): Promise<void> {
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
            this.storages.bundles.findLatestByNameAndTag(bundleName, bundleTag),
            this.storages.apps.findOneByName(appName),
            this.storages.entrypoints.findOneByUrlMatcher(entrypointUrlMatcher)
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
            app = await this.makeUsecase(CreateApp).exec({ name: appName });
        }

        if (!existingEntrypoint) {
            // Create the entrypoint if it doesn't exist
            await this.makeUsecase(CreateEntrypoint).exec({
                appId: app.id,
                bundleId: bundle.id,
                urlMatcher: entrypointUrlMatcher
            });
        } else {
            // Otherwise, just update the existing entrypoint to point it to the
            // supplied bundle
            await this.makeUsecase(UpdateEntrypoint).exec(
                existingEntrypoint.id,
                { bundleId: bundle.id }
            );
        }
    }
}
