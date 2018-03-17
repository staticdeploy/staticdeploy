import convroute from "common/convroute";
import storage from "services/storage";

export default convroute({
    path: "/bundles",
    method: "get",
    description: "Get all bundles",
    tags: ["bundles"],
    responses: {
        "200": { description: "Returns an array of all bundles" }
    },
    handler: async (_req, res) => {
        const bundles = await storage.bundles.findAll();
        res.status(200).send(bundles);
    }
});
