import { BundleNotFoundError } from "@staticdeploy/storage";
import { Request } from "express";

import convroute from "common/convroute";
import storage from "services/storage";

interface IRequest extends Request {
    params: {
        bundleId: string;
    };
}

export default convroute({
    path: "/bundles/:bundleId",
    method: "get",
    description: "Get bundle",
    tags: ["bundles"],
    responses: {
        "200": { description: "Returns the bundle" },
        "404": { description: "Bundle not found" }
    },
    handler: async (req: IRequest, res) => {
        const bundle = await storage.bundles.findOneById(req.params.bundleId);

        // Ensure the bundle exists
        if (!bundle) {
            throw new BundleNotFoundError(req.params.bundleId, "id");
        }

        res.status(200).send(bundle);
    }
});
