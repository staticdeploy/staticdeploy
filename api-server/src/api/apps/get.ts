import convroute from "common/convroute";
import App from "models/App";

export default convroute({
    path: "/apps",
    method: "get",
    description: "Get all apps",
    tags: ["apps"],
    responses: {
        "200": { description: "Returns an array of all apps" }
    },
    handler: async (_req, res) => {
        // Find all apps
        const apps = await App.findAll();

        // Respond to the client
        res.status(200).send(apps);
    }
});
