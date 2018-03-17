import { IBundle } from "@staticdeploy/storage";
import { Request } from "express";

import convroute from "common/convroute";
import storage from "services/storage";

interface IRequest extends Request {
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

        // Create the bundle
        const bundle = await storage.bundles.create({
            name: partial.name,
            tag: partial.tag,
            description: partial.description,
            content: Buffer.from(partial.content, "base64")
        });

        // Respond to the client
        res.status(201).send(bundle);
    }
});
