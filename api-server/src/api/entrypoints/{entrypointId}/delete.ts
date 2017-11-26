import { Request } from "express";

import convroute from "common/convroute";
import Entrypoint from "models/Entrypoint";

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
        const { entrypointId } = req.params;

        // Find the entrypoint
        const entrypoint = await Entrypoint.findById(entrypointId);

        // Ensure the entrypoint exists
        if (!entrypoint) {
            res.status(404).send({
                message: `No entrypoint found with id = ${entrypointId}`
            });
            return;
        }

        // Delete the entrypoint
        await entrypoint.destroy();

        // Respond to the client
        res.status(204).send();
    }
});
