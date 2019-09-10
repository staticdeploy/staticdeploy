import { IEntrypoint } from "@staticdeploy/core";

import IBaseRequest from "../../IBaseRequest";
import convroute from "../convroute";

interface IRequest extends IBaseRequest {
    body: {
        appId: IEntrypoint["appId"];
        bundleId?: IEntrypoint["bundleId"];
        redirectTo?: IEntrypoint["redirectTo"];
        urlMatcher: IEntrypoint["urlMatcher"];
        configuration?: IEntrypoint["configuration"];
    };
}

const bodySchema = {
    type: "object",
    properties: {
        appId: {
            type: "string"
        },
        bundleId: {
            $oneOf: [{ type: "string" }, { type: "null" }]
        },
        redirectTo: {
            $oneOf: [{ type: "string" }, { type: "null" }]
        },
        urlMatcher: {
            type: "string"
        },
        configuration: {
            $oneOf: [{ type: "object" }, { type: "null" }]
        }
    },
    required: ["appId", "urlMatcher"],
    additionalProperties: false
};

export default convroute({
    path: "/entrypoints",
    method: "post",
    description: "Create new entrypoint",
    tags: ["entrypoints"],
    parameters: [
        {
            name: "entrypoint",
            in: "body",
            required: true,
            schema: bodySchema
        }
    ],
    responses: {
        "201": { description: "Entrypoint created, returns the entrypoint" },
        "404": { description: "Linked app or bundle not found" },
        "409": { description: "Entrypoint with same urlMatcher already exists" }
    },
    handler: async (req: IRequest, res) => {
        const createEntrypoint = req.makeUsecase("createEntrypoint");
        const createdEntrypoint = await createEntrypoint.exec(req.body);
        res.status(201).send(createdEntrypoint);
    }
});
