import convroute from "common/convroute";
import App from "models/App";

export default convroute({
    path: "/apps/:appId",
    method: "delete",
    description: "Delete app",
    tags: ["apps"],
    parameters: [
        {
            name: "appId",
            in: "path",
            type: "string"
        }
    ],
    responses: {
        "204": { description: "App deleted, returns nothing" },
        "404": { description: "App not found" }
    },
    handler: async (req, res) => {
        const { appId } = req.params;
        const app = await App.findById(appId);
        if (app) {
            await app.destroy();
            res.status(204).send(app);
        } else {
            res.status(404).send({
                message: `No app found with id = ${appId}`
            });
        }
    }
});
