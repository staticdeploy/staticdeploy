import convroute from "common/convroute";
import App, { schema } from "models/App";

export default convroute({
    path: "/apps/:appId",
    method: "patch",
    description: "Update app",
    tags: ["apps"],
    parameters: [
        {
            name: "appId",
            in: "path",
            type: "string"
        },
        {
            name: "patch",
            in: "body",
            required: true,
            schema: { ...schema, required: [] }
        }
    ],
    responses: {
        "200": { description: "App updated, returns the app" },
        "400": { description: "Patch validation failed" },
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
        const patch = req.body;
        if (patch.name) {
            const appWithSameName = await App.findOne({
                where: { name: patch.name }
            });
            if (appWithSameName && appWithSameName.id !== app.id) {
                res.status(409).send({
                    message: `An app with name = ${patch.name} already exists`
                });
                return;
            }
        }
        await app.update(patch);
        res.status(200).send(app);
    }
});
