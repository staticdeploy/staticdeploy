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
    method: "delete",
    description: "Delete bundle",
    tags: ["bundles"],
    parameters: [
        {
            name: "bundleId",
            in: "path",
            required: true,
            type: "string"
        }
    ],
    responses: {
        "204": { description: "Bundle deleted, returns nothing" },
        "404": { description: "Bundle not found" }
    },
    handler: async (req: IRequest, res) => {
        await storage.bundles.delete(req.params.bundleId);
        res.status(204).send();
    }
});
