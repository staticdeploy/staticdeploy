import { IBundle, Operation } from "@staticdeploy/common-types";

import convroute from "common/convroute";
import IBaseRequest from "common/IBaseRequest";
import storage from "services/storage";

interface IRequest extends IBaseRequest {
    body: {
        name: IBundle["name"];
        tag: IBundle["tag"];
        description: IBundle["description"];
        // Base64 encoded content
        content: string;
        fallbackAssetPath: string;
        fallbackStatusCode: number;
        headers: {
            [assetMatcher: string]: {
                [headerName: string]: string;
            };
        };
    };
}

const bodySchema = {
    type: "object",
    properties: {
        name: {
            type: "string"
        },
        tag: {
            type: "string"
        },
        description: {
            type: "string"
        },
        content: {
            description: "Base64 encoded bundle content",
            type: "string"
        },
        fallbackAssetPath: {
            type: "string"
        },
        fallbackStatusCode: {
            type: "number"
        },
        headers: {
            type: "object",
            additionalProperties: {
                type: "object",
                additionalProperties: {
                    type: "string"
                }
            }
        }
    },
    required: [
        "name",
        "tag",
        "description",
        "content",
        "fallbackAssetPath",
        "fallbackStatusCode",
        "headers"
    ],
    additionalProperties: false
};

export default convroute({
    path: "/bundles",
    method: "post",
    description: "Create new bundle",
    tags: ["bundles"],
    parameters: [
        {
            name: "bundle",
            in: "body",
            required: true,
            schema: bodySchema
        }
    ],
    responses: {
        "201": { description: "Bundle created, returns the bundle" },
        "400": { description: "Body validation failed" }
    },
    handler: async (req: IRequest, res) => {
        const partial = req.body;

        const createdBundle = await storage.bundles.create({
            name: partial.name,
            tag: partial.tag,
            description: partial.description,
            content: Buffer.from(partial.content, "base64"),
            fallbackAssetPath: partial.fallbackAssetPath,
            fallbackStatusCode: partial.fallbackStatusCode,
            headers: partial.headers
        });

        await req.logOperation(Operation.createBundle, { createdBundle });

        res.status(201).send(createdBundle);
    }
});
