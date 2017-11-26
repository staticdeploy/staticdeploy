import { Request } from "express";

import convroute from "common/convroute";
import App from "models/App";

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

        // Find the app
        const app = await App.findById(appId);

        // Ensure the app exists
        if (!app) {
            res.status(404).send({
                message: `No app found with id = ${appId}`
            });
            return;
        }

        // Respond to the client
        res.status(200).send(app);
    }
});
