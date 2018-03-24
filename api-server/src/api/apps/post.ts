import { IApp } from "@staticdeploy/storage";
import { Request } from "express";

import convroute from "common/convroute";
import storage from "services/storage";

interface IRequest extends Request {
    body: {
        name: IApp["name"];
        defaultConfiguration?: IApp["defaultConfiguration"];
    };
}

const bodySchema = {
    type: "object",
    properties: {
        name: { type: "string" },
        defaultConfiguration: { type: "object" }
    },
    required: ["name"],
    additionalProperties: false
};

export default convroute({
    path: "/apps",
    method: "post",
    description: "Create new app",
    tags: ["apps"],
    parameters: [
        {
            name: "app",
            in: "body",
            required: true,
            schema: bodySchema
        }
    ],
    responses: {
        "201": { description: "App created, returns the app" },
        "400": { description: "Body validation failed" },
        "409": { description: "App with same name already exists" }
    },
    handler: async (req: IRequest, res) => {
        const app = await storage.apps.create(req.body);
        res.status(201).send(app);
    }
});
