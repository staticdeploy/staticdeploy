import { IApp } from "@staticdeploy/core";

import IBaseRequest from "../../IBaseRequest";
import convroute from "../convroute";

interface IRequest extends IBaseRequest {
    params: {
        appId: string;
    };
    body: {
        defaultConfiguration?: IApp["defaultConfiguration"];
    };
}

const bodySchema = {
    type: "object",
    properties: {
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
        "404": { description: "App not found" }
    },
    handler: async (req: IRequest, res) => {
        const updateApp = req.makeUsecase("updateApp");
        const updatedApp = await updateApp.exec(req.params.appId, req.body);
        res.status(200).send(updatedApp);
    }
});
