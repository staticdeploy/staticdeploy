import convroute from "common/convroute";
import IBaseRequest from "common/IBaseRequest";
import { Operation } from "services/operations";
import storage from "services/storage";

interface IRequest extends IBaseRequest {
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
        // Retrieve deleted bundle for the operation log
        const deletedBundle = await storage.bundles.findOneById(
            req.params.bundleId
        );

        await storage.bundles.delete(req.params.bundleId);

        await req.logOperation(Operation.deleteBundle, { deletedBundle });

        res.status(204).send();
    }
});
