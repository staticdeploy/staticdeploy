import convroute from "common/convroute";
import storage from "services/storage";

export default convroute({
    path: "/operationLogs",
    method: "get",
    description: "Get all operationLogs",
    tags: ["operationLogs"],
    responses: {
        "200": { description: "Returns an array of all operationLogs" }
    },
    handler: async (_req, res) => {
        const operationLogs = await storage.operationLogs.findAll();

        res.status(200).send(operationLogs);
    }
});
