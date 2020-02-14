import { IExternalCache } from "@staticdeploy/core";

import IBaseRequest from "../../IBaseRequest";
import convroute from "../convroute";

interface IRequest extends IBaseRequest {
    body: {
        domain: IExternalCache["domain"];
        type: IExternalCache["type"];
        configuration: IExternalCache["configuration"];
    };
}

const bodySchema = {
    type: "object",
    properties: {
        domain: { type: "string" },
        type: { type: "string" },
        configuration: { type: "object" }
    },
    required: ["domain", "type", "configuration"],
    additionalProperties: false
};

export default convroute({
    path: "/externalCaches",
    method: "post",
    description: "Create a new external cache",
    tags: ["externalCaches"],
    parameters: [
        {
            name: "externalCache",
            in: "body",
            required: true,
            schema: bodySchema
        }
    ],
    responses: {
        "201": {
            description: "External cache created, returns the external cache"
        },
        "409": { description: "External cache with same domain already exists" }
    },
    handler: async (req: IRequest, res) => {
        const createExternalCache = req.makeUsecase("createExternalCache");
        const createdExternalCache = await createExternalCache.exec(req.body);
        res.status(201).send(createdExternalCache);
    }
});
