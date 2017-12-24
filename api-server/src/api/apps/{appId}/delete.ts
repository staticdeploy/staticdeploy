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
    method: "delete",
    description: "Delete app",
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
        "204": { description: "App deleted, returns nothing" },
        "404": { description: "App not found" }
    },
    handler: async (req: IRequest, res) => {
        await storage.apps.delete(req.params.appId);
        res.status(204).send();
    }
});
