import { IBundle } from "@staticdeploy/common-types";

import convroute from "common/convroute";
import IBaseRequest from "common/IBaseRequest";
import { Operation } from "services/operations";
import storage from "services/storage";

interface IRequest extends IBaseRequest {
    body: {
        name: IBundle["name"];
        tag: IBundle["tag"];
        description: IBundle["description"];
        // Base64 encoded content
        content: string;
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
            // Base64 encoded content
            type: "string"
        }
    },
    required: ["name", "tag", "description", "content"],
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
            content: Buffer.from(partial.content, "base64")
        });

        await req.logOperation(Operation.createBundle, { createdBundle });

        res.status(201).send(createdBundle);
    }
});
