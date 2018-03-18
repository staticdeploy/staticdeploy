import { IApp } from "@staticdeploy/storage";
import { Request } from "express";

import convroute from "common/convroute";
import storage from "services/storage";

interface IRequest extends Request {
    params: {
        appId: string;
    };
    body: {
        name?: IApp["name"];
        defaultConfiguration?: IApp["defaultConfiguration"];
    };
}

const bodySchema = {
    type: "object",
    properties: {
        name: { type: "string" },
        defaultConfiguration: { type: "object" }
    },
    additionalProperties: false
};

export default convroute({
    path: "/apps/:appId",
    method: "patch",
    description: "Update app",
    tags: ["apps"],
    parameters: [
        {
            name: "appId",
            in: "path",
            required: true,
            type: "string"
        },
        {
            name: "patch",
            in: "body",
            required: true,
            schema: bodySchema
        }
    ],
    responses: {
        "200": { description: "App updated, returns the app" },
        "400": { description: "Patch validation failed" },
        "404": { description: "App not found" },
        "409": { description: "App with same name already exists" }
    },
    handler: async (req: IRequest, res) => {
        const app = await storage.apps.update(req.params.appId, req.body);
        res.status(200).send(app);
    }
});
