import { Request } from "express";

import convroute from "common/convroute";
import * as schemas from "common/schemas";
import App from "models/App";

interface IRequest extends Request {
    params: {
        appId: string;
    };
    body: {
        name?: App["name"];
        defaultConfiguration?: App["defaultConfiguration"];
    };
}

const bodySchema = {
    type: "object",
    properties: {
        name: schemas.appName,
        defaultConfiguration: schemas.configuration
    },
    additionalProperties: false
};

export default convroute({
    path: "/apps/:appId",
    method: "patch",
    description: "Update app",
    tags: ["apps"],
    parameters: [
        {
            name: "appId",
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
        "200": { description: "App updated, returns the app" },
        "400": { description: "Patch validation failed" },
        "404": { description: "App not found" },
        "409": { description: "App with same name already exists" }
    },
    handler: async (req: IRequest, res) => {
        const { appId } = req.params;
        const patch = req.body;

        // Find the app
        const app = await App.findById(appId);

        // Ensure the app exists
        if (!app) {
            res.status(404).send({
                message: `No app found with id = ${appId}`
            });
            return;
        }

        // Ensure no app with the patched name exists
        if (patch.name) {
            const conflictingApp = await App.findOne({
                where: { name: patch.name }
            });
            if (conflictingApp && conflictingApp.id !== app.id) {
                res.status(409).send({
                    message: `An app with name = ${patch.name} already exists`
                });
                return;
            }
        }

        // Update the app
        await app.update(patch);

        // Respond to the client
        res.status(200).send(app);
    }
});
