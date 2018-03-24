import { IEntrypoint } from "@staticdeploy/storage";
import { Request } from "express";

import convroute from "common/convroute";
import storage from "services/storage";

interface IRequest extends Request {
    body: {
        appId: IEntrypoint["appId"];
        bundleId?: IEntrypoint["bundleId"];
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
        "400": { description: "Body validation failed" },
        "404": { description: "Linked app or bundle not found" },
        "409": { description: "Entrypoint with same urlMatcher already exists" }
    },
    handler: async (req: IRequest, res) => {
        const entrypoint = await storage.entrypoints.create(req.body);
        res.status(201).send(entrypoint);
    }
});
