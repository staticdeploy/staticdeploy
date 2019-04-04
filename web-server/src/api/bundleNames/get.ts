import convroute from "common/convroute";
import storage from "services/storage";

export default convroute({
    path: "/bundleNames",
    method: "get",
    description: "Get all bundle names",
    tags: ["bundles"],
    responses: {
        "200": { description: "Returns an array of bundle names" }
    },
    handler: async (_req, res) => {
        const bundleNames = await storage.bundles.findNames();

        res.status(200).send(bundleNames);
    }
});
