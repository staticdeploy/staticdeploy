import { IApp } from "@staticdeploy/storage";

import convroute from "common/convroute";
import IBaseRequest from "common/IBaseRequest";
import { Operation } from "services/operations";
import storage from "services/storage";

interface IRequest extends IBaseRequest {
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
        const createdApp = await storage.apps.create(req.body);

        await req.logOperation(Operation.createApp, { createdApp });

        res.status(201).send(createdApp);
    }
});
