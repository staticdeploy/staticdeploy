import convroute from "common/convroute";
import App, { schema } from "models/App";

export default convroute({
    path: "/apps/:appId/name",
    method: "put",
    description: "Update app name",
    tags: ["apps"],
    parameters: [
        {
            name: "appId",
            in: "path",
            type: "string"
        },
        {
            name: "appName",
            in: "body",
            required: true,
            schema: schema.properties.name
        }
    ],
    responses: {
        "200": { description: "App name updated, returns the app" },
        "400": { description: "name validation failed" },
        "404": { description: "App not found" },
        "409": { description: "App with same name already exists" }
    },
    handler: async (req, res) => {
        const { appId } = req.params;
        const app = await App.findById(appId);
        if (!app) {
            res.status(404).send({
                message: `No app found with id = ${appId}`
            });
            return;
        }
        const newName = req.body;
        const appWithSameName = await App.findOne({ where: { name: newName } });
        if (appWithSameName && appWithSameName.id !== app.id) {
            res.status(409).send({
                message: `An app with name = ${newName} already exists`
            });
            return;
        }
        await app.update({ name: newName });
        res.status(200).send(app);
    }
});
