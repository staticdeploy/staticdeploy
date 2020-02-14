import { map } from "lodash";

import { BundlesInUseError } from "../common/functionalErrors";
import Usecase from "../common/Usecase";
import { Operation } from "../entities/OperationLog";

type Arguments = [string, string];
type ReturnValue = void;

export default class DeleteBundlesByNameAndTag extends Usecase<
    Arguments,
    ReturnValue
> {
    protected async _exec(
        name: Arguments[0],
        tag: Arguments[1]
    ): Promise<ReturnValue> {
        // Auth check
        this.authorizer.ensureCanDeleteBundles(name);

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
