import convroute from "common/convroute";
import App, { schema } from "models/App";

export default convroute({
    path: "/apps/:appId/defaultConfiguration",
    method: "put",
    description: "Update app defaultConfiguration",
    tags: ["apps"],
    parameters: [
        {
            name: "appId",
            in: "path",
            type: "string"
        },
        {
            name: "appDefaultConfiguration",
            in: "body",
            required: true,
            schema: schema.properties.defaultConfiguration
        }
    ],
    responses: {
        "200": {
            description: "App defaultConfiguration updated, returns the app"
        },
        "400": { description: "defaultConfiguration validation failed" },
        "404": { description: "App not found" }
    },
    handler: async (req, res) => {
        const { appId } = req.params;
        const app = await App.findById(appId);
        if (app) {
            await app.update({ defaultConfiguration: req.body });
            res.status(200).send(app);
        } else {
            res.status(404).send({
                message: `No app found with id = ${appId}`
            });
        }
    }
});
