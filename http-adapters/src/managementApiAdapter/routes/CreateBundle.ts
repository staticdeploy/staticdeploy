import { IBundle } from "@staticdeploy/core";

import IBaseRequest from "../../IBaseRequest";
import convroute from "../convroute";

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
        "400": { description: "Body validation failed" },
        "401": { description: "Authentication required" },
        "403": { description: "Missing authorization roles" }
    },
    handler: async (req: IRequest, res) => {
        const createBundle = req.makeUsecase("createBundle");
        const createdBundle = await createBundle.exec({
            ...req.body,
            content: Buffer.from(req.body.content, "base64")
        });
        res.status(201).send(createdBundle);
    }
});
