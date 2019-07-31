import { IEntrypoint } from "@staticdeploy/core";

import IBaseRequest from "../../IBaseRequest";
import convroute from "../convroute";

interface IRequest extends IBaseRequest {
    params: {
        entrypointId: string;
    };
    body: {
        bundleId?: IEntrypoint["bundleId"];
        redirectTo?: IEntrypoint["redirectTo"];
        configuration?: IEntrypoint["configuration"];
    };
}

const bodySchema = {
    type: "object",
    properties: {
        bundleId: {
            $oneOf: [{ type: "string" }, { type: "null" }]
        },
        redirectTo: {
            $oneOf: [{ type: "string" }, { type: "null" }]
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
        "401": { description: "Authentication required" },
        "403": { description: "Missing authorization roles" },
        "404": {
            description: "Entrypoint, linked app, or linked bundle not found"
        },
        "409": { description: "Entrypoint with same urlMatcher already exists" }
    },
    handler: async (req: IRequest, res) => {
        const updateEntrypoint = req.makeUsecase("updateEntrypoint");
        const updatedEntrypoint = await updateEntrypoint.exec(
            req.params.entrypointId,
            req.body
        );
        res.status(200).send(updatedEntrypoint);
    }
});
