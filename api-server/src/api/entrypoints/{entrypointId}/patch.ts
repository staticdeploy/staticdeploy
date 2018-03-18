import { IEntrypoint } from "@staticdeploy/storage";
import { Request } from "express";

import convroute from "common/convroute";
import storage from "services/storage";

interface IRequest extends Request {
    params: {
        entrypointId: string;
    };
    body: {
        appId?: IEntrypoint["appId"];
        bundleId?: IEntrypoint["bundleId"];
        urlMatcher?: IEntrypoint["urlMatcher"];
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
    additionalProperties: false
};

export default convroute({
    path: "/entrypoints/:entrypointId",
    method: "patch",
    description: "Update entrypoint",
    tags: ["entrypoints"],
    parameters: [
        {
            name: "entrypointId",
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
        "200": { description: "Entrypoint updated, returns the entrypoint" },
        "400": { description: "Patch validation failed" },
        "404": {
            description: "Entrypoint, linked app, or linked bundle not found"
        },
        "409": { description: "Entrypoint with same urlMatcher already exists" }
    },
    handler: async (req: IRequest, res) => {
        const entrypoint = await storage.entrypoints.update(
            req.params.entrypointId,
            req.body
        );
        res.status(200).send(entrypoint);
    }
});
