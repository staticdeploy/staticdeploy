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
    method: "get",
    description: "Get all bundles with the specified name and tag",
    tags: ["bundles"],
    responses: {
        "200": {
            description:
                "Returns an array of bundles with the specified name and tag"
        }
    },
    handler: async (req: IRequest, res) => {
        const { bundleName, bundleTag } = req.params;
        const bundles = await storage.bundles.findByNameTagCombination(
            BundlesClient.formNameTagCombination(bundleName, bundleTag)
        );

        res.status(200).send(bundles);
    }
});
