import { isEmpty, map } from "lodash";

import { BundlesInUseError } from "../common/errors";
import Usecase from "../common/Usecase";
import { splitNameTagCombination } from "../entities/Bundle";
import { Operation } from "../entities/OperationLog";

export default class DeleteBundlesByNameTagCombination extends Usecase {
    async exec(nameTagCombination: string): Promise<void> {
        // Ensure the request is authenticated
        this.authorizer.ensureAuthenticated();

        const [name, tag] = splitNameTagCombination(nameTagCombination);

        // Find bundles to be deleted
        const toBeDeletedBundles = await this.storages.bundles.findManyByNameAndTag(
            name,
            tag
        );
        const toBeDeletedBundleIds = map(toBeDeletedBundles, "id");

        // Ensure the bundles are not used by any entrypoint
        const dependentEntrypoints = await this.storages.entrypoints.findManyByBundleIds(
            toBeDeletedBundleIds
        );
        if (!isEmpty(dependentEntrypoints)) {
            throw new BundlesInUseError(
                toBeDeletedBundleIds,
                map(dependentEntrypoints, "id")
            );
        }

        // Delete the bundles
        await this.storages.bundles.deleteMany(toBeDeletedBundleIds);

        // Log the operation
        await this.operationLogger.logOperation(Operation.deleteBundle, {
            deletedBundles: toBeDeletedBundles
        });
    }
}
