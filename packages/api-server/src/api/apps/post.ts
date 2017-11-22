import { Request } from "express";

import convroute from "common/convroute";
import generateId from "common/generateId";
import App, { schema } from "models/App";

interface IRequest extends Request {
    body: {
        name: App["name"];
        defaultConfiguration?: App["defaultConfiguration"];
    };
}

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
            schema: schema
        }
    ],
    responses: {
        "201": { description: "App created, returns the app" },
        "400": { description: "Body validation failed" },
        "409": { description: "App with same name already exists" }
    },
    handler: async (req: IRequest, res) => {
        const { body } = req;
        const existingApp = await App.findOne({
            where: { name: body.name }
        });
        if (existingApp) {
            res.status(409).send({
                message: `An app with name = ${body.name} already exists`
            });
        } else {
            const app = await App.create({
                id: generateId(),
                name: body.name,
                defaultConfiguration: body.defaultConfiguration
            });
            res.status(201).send(app);
        }
    }
});
