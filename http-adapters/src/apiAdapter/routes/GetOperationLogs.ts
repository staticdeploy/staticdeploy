import convroute from "../convroute";

export default convroute({
    path: "/operationLogs",
    method: "get",
    description: "Get all operationLogs",
    tags: ["operationLogs"],
    responses: {
        "200": { description: "Returns an array of all operationLogs" },
        "401": { description: "Authentication required" }
    },
    handler: async (req, res) => {
        const getOperationLogs = req.makeUsecase("getOperationLogs");
        const operationLogs = await getOperationLogs.exec();
        res.status(200).send(operationLogs);
    }
});
