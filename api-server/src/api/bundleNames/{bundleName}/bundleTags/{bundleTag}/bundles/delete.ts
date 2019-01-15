import { Operation } from "@staticdeploy/common-types";
import BundlesClient from "@staticdeploy/storage/lib/BundlesClient";

import convroute from "common/convroute";
import IBaseRequest from "common/IBaseRequest";
import storage from "services/storage";

interface IRequest extends IBaseRequest {
    params: {
        bundleName: string;
        bundleTag: string;
    };
}

export default convroute({
    path: "/bundleNames/:bundleName/bundleTags/:bundleTag/bundles",
    method: "delete",
    description: "Delete all bundles with the specified name and tag",
    tags: ["bundles"],
    responses: {
        "204": {
            description: "Bundles deleted, returns nothing"
        },
        "409": {
            description:
                "Bundles can't be deleted because in use by one or more entrypoints"
        }
    },
    handler: async (req: IRequest, res) => {
        const { bundleName, bundleTag } = req.params;
        const nameTagCombination = BundlesClient.formNameTagCombination(
            bundleName,
            bundleTag
        );

        // Retrieve to-be-deleted bundles for the operation log
        const deletedBundles = await storage.bundles.findByNameTagCombination(
            nameTagCombination
        );

        const bundles = await storage.bundles.deleteByNameTagCombination(
            nameTagCombination
        );

        await req.logOperation(Operation.deleteBundle, { deletedBundles });

        res.status(204).send(bundles);
    }
});
