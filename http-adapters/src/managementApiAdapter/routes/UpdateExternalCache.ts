import { IExternalCache } from "@staticdeploy/core";

import IBaseRequest from "../../IBaseRequest";
import convroute from "../convroute";

interface IRequest extends IBaseRequest {
    params: {
        externalCacheId: string;
    };
    body: {
        domain?: IExternalCache["domain"];
        type?: IExternalCache["type"];
        configuration?: IExternalCache["configuration"];
    };
}

const bodySchema = {
    type: "object",
    properties: {
        domain: { type: "string" },
        type: { type: "string" },
        configuration: { type: "object" }
    },
    additionalProperties: false
};

export default convroute({
    path: "/externalCaches/:externalCacheId",
    method: "patch",
    description: "Update external cache",
    tags: ["externalCaches"],
    parameters: [
        {
            name: "externalCacheId",
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
        "200": {
            description: "External cache updated, returns the external cache"
        },
        "404": { description: "External cache not found" },
        "409": { description: "External cache with same domain already exists" }
    },
    handler: async (req: IRequest, res) => {
        const updateExternalCache = req.makeUsecase("updateExternalCache");
        const updatedExternalCache = await updateExternalCache.exec(
            req.params.externalCacheId,
            req.body
        );
        res.status(200).send(updatedExternalCache);
    }
});
