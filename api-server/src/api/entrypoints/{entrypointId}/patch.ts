import { IEntrypoint, Operation } from "@staticdeploy/common-types";

import convroute from "common/convroute";
import IBaseRequest from "common/IBaseRequest";
import storage from "services/storage";

interface IRequest extends IBaseRequest {
    params: {
        entrypointId: string;
    };
    body: {
        appId?: IEntrypoint["appId"];
        bundleId?: IEntrypoint["bundleId"];
        redirectTo?: IEntrypoint["redirectTo"];
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
        // Retrieve the old entrypoint for the operation log
        const oldEntrypoint = await storage.entrypoints.findOneById(
            req.params.entrypointId
        );

        const newEntrypoint = await storage.entrypoints.update(
            req.params.entrypointId,
            req.body
        );

        await req.logOperation(Operation.updateEntrypoint, {
            oldEntrypoint,
            newEntrypoint
        });

        res.status(200).send(newEntrypoint);
    }
});
