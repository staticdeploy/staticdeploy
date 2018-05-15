import { IApp } from "@staticdeploy/storage";

import convroute from "common/convroute";
import IBaseRequest from "common/IBaseRequest";
import { Operation } from "services/operations";
import storage from "services/storage";

interface IRequest extends IBaseRequest {
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
        // Retrieve the old app for the operation log
        const oldApp = await storage.apps.findOneById(req.params.appId);

        const newApp = await storage.apps.update(req.params.appId, req.body);

        await req.logOperation(Operation.updateApp, { oldApp, newApp });

        res.status(200).send(newApp);
    }
});
