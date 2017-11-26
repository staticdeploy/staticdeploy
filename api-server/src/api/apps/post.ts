import { Request } from "express";

import convroute from "common/convroute";
import generateId from "common/generateId";
import * as schemas from "common/schemas";
import App from "models/App";

interface IRequest extends Request {
    body: {
        name: App["name"];
        defaultConfiguration?: App["defaultConfiguration"];
    };
}

const bodySchema = {
    type: "object",
    properties: {
        name: schemas.appName,
        defaultConfiguration: schemas.configuration
    },
    required: ["name"],
    additionalProperties: false
};

export default convroute({
    path: "/apps",
    method: "post",
    description: "Create new app",
    tags: ["apps"],
    parameters: [
        {
            name: "app",
            in: "body",
            required: true,
            schema: bodySchema
        }
    ],
    responses: {
        "201": { description: "App created, returns the app" },
        "400": { description: "Body validation failed" },
        "409": { description: "App with same name already exists" }
    },
    handler: async (req: IRequest, res) => {
        const { body } = req;

        // Ensure no app with the same name exists
        const conflictingApp = await App.findOne({
            where: { name: body.name }
        });
        if (conflictingApp) {
            res.status(409).send({
                message: `An app with name = ${body.name} already exists`
            });
            return;
        }

        // Create the app
        const app = await App.create({
            id: generateId(),
            name: body.name,
            defaultConfiguration: body.defaultConfiguration
        });

        // Respond to the client
        res.status(201).send(app);
    }
});
