import { Request } from "express";

import convroute from "common/convroute";
import generateId from "common/generateId";
import * as schemas from "common/schemas";
import App from "models/App";
import Entrypoint from "models/Entrypoint";

interface IRequest extends Request {
    body: {
        appId: Entrypoint["appId"];
        urlMatcher: Entrypoint["urlMatcher"];
        urlMatcherPriority?: Entrypoint["urlMatcherPriority"];
        smartRoutingEnabled?: Entrypoint["smartRoutingEnabled"];
        configuration?: Entrypoint["configuration"];
    };
}

const bodySchema = {
    type: "object",
    properties: {
        appId: {
            type: "string"
        },
        urlMatcher: {
            type: "string"
        },
        urlMatcherPriority: {
            type: "number"
        },
        smartRoutingEnabled: {
            type: "boolean"
        },
        configuration: schemas.configuration
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
        "404": { description: "Linked app not found" },
        "409": { description: "Entrypoint with same urlMatcher already exists" }
    },
    handler: async (req: IRequest, res) => {
        const { body } = req;

        // Ensure the linked app exists
        const linkedApp = await App.findById(body.appId);
        if (!linkedApp) {
            res.status(404).send({
                message: `No app found with id = ${body.appId}`
            });
            return;
        }

        // Ensure no entrypoint with the same urlMatcher exists
        const conflictingEntrypoint = await Entrypoint.findOne({
            where: { urlMatcher: body.urlMatcher }
        });
        if (conflictingEntrypoint) {
            res.status(409).send({
                message: `An entrypoint with urlMatcher = ${
                    body.urlMatcher
                } already exists`
            });
            return;
        }

        // Create the entrypoint
        const entrypoint = await Entrypoint.create({
            id: generateId(),
            ...body
        });

        // Respond to the client
        res.status(201).send(entrypoint);
    }
});
