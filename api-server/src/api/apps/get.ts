import convroute from "common/convroute";
import storage from "services/storage";

export default convroute({
    path: "/apps",
    method: "get",
    description: "Get all apps",
    tags: ["apps"],
    responses: {
        "200": { description: "Returns an array of all apps" }
    },
    handler: async (_req, res) => {
        const apps = await storage.apps.findAll();
        res.status(200).send(apps);
    }
});
