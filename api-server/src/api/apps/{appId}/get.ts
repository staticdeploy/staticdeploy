import { Request } from "express";

import convroute from "common/convroute";
import storage from "services/storage";

interface IRequest extends Request {
    params: {
        appId: string;
    };
}

export default convroute({
    path: "/apps/:appId",
    method: "get",
    description: "Get app",
    tags: ["apps"],
    parameters: [
        {
            name: "appId",
            in: "path",
            required: true,
            type: "string"
        }
    ],
    responses: {
        "200": { description: "Returns the app" },
        "404": { description: "App not found" }
    },
    handler: async (req: IRequest, res) => {
        const { appId } = req.params;
        const app = await storage.apps.findOneById(appId);

        // Ensure the app exists
        if (!app) {
            res.status(404).send({
                message: `No app found with id = ${appId}`
            });
            return;
        }

        res.status(200).send(app);
    }
});
