import { IApp } from "@staticdeploy/core";

import IBaseRequest from "../../IBaseRequest";
import convroute from "../convroute";

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
        defaultConfiguration: { type: "object" },
    },
    required: ["name"],
    additionalProperties: false,
};

export default convroute({
    path: "/apps",
    method: "post",
    description: "Create a new app",
    tags: ["apps"],
    parameters: [
        {
            name: "app",
            in: "body",
            required: true,
            schema: bodySchema,
        },
    ],
    responses: {
        "201": { description: "App created, returns the app" },
        "409": { description: "App with same name already exists" },
    },
    handler: async (req: IRequest, res) => {
        const createApp = req.makeUsecase("createApp");
        const createdApp = await createApp.exec(req.body);
        res.status(201).send(createdApp);
    },
});
