import { Request } from "express";

import convroute from "common/convroute";
import storage from "services/storage";

interface IRequest extends Request {
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
        await storage.entrypoints.delete(req.params.entrypointId);
        res.status(204).send();
    }
});
