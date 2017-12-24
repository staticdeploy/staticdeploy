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
    method: "get",
    description: "Get entrypoint",
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
        "200": { description: "Returns the entrypoint" },
        "404": { description: "Entrypoint not found" }
    },
    handler: async (req: IRequest, res) => {
        const { entrypointId } = req.params;
        const entrypoint = await storage.entrypoints.findOneById(entrypointId);

        // Ensure the entrypoint exists
        if (!entrypoint) {
            res.status(404).send({
                message: `No entrypoint found with id = ${entrypointId}`
            });
            return;
        }

        res.status(200).send(entrypoint);
    }
});
