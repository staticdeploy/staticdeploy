import convroute from "common/convroute";
import IBaseRequest from "common/IBaseRequest";
import { Operation } from "services/operations";
import storage from "services/storage";

interface IRequest extends IBaseRequest {
    params: {
        entrypointId: string;
    };
}

export default convroute({
    path: "/entrypoints/:entrypointId",
    method: "delete",
    description: "Delete entrypoint",
    tags: ["entrypoints"],
    parameters: [
        {
            name: "entrypointId",
            in: "path",
            required: true,
            type: "string"
        }
    ],
    responses: {
        "204": { description: "Entrypoint deleted, returns nothing" },
        "404": { description: "Entrypoint not found" }
    },
    handler: async (req: IRequest, res) => {
        // Retrieve deleted entrypoint for the operation log
        const deletedEntrypoint = await storage.entrypoints.findOneById(
            req.params.entrypointId
        );

        await storage.entrypoints.delete(req.params.entrypointId);

        await req.logOperation(Operation.deleteEntrypoint, {
            deletedEntrypoint
        });

        res.status(204).send();
    }
});
