import { map } from "lodash";

import { BundlesInUseError } from "../common/errors";
import Usecase from "../common/Usecase";
import { Operation } from "../entities/OperationLog";

export default class DeleteBundlesByNameAndTag extends Usecase {
    async exec(name: string, tag: string): Promise<void> {
        // Auth check
        await this.authorizer.ensureCanDeleteBundles(name);

        // Find bundles to be deleted
        const toBeDeletedBundles = await this.storages.bundles.findManyByNameAndTag(
            name,
            tag
        );
        const toBeDeletedBundleIds = map(toBeDeletedBundles, "id");

        // Ensure the bundles are not used by any entrypoint
        const hasLinkedEntrypoints = await this.storages.entrypoints.anyExistsWithBundleIdIn(
            toBeDeletedBundleIds
        );
        if (hasLinkedEntrypoints) {
            throw new BundlesInUseError(toBeDeletedBundleIds);
        }

        // Delete the bundles
        await this.storages.bundles.deleteMany(toBeDeletedBundleIds);

        // Log the operation
        await this.operationLogger.logOperation(Operation.DeleteBundle, {
            deletedBundles: toBeDeletedBundles
        });
    }
}
