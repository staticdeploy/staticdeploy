import convroute from "../convroute";

export default convroute({
    path: "/apps",
    method: "get",
    description: "Get all apps",
    tags: ["apps"],
    responses: {
        "200": { description: "Returns an array of all apps" },
        "401": { description: "Authentication required" }
    },
    handler: async (req, res) => {
        const getApps = req.makeUsecase("getApps");
        const apps = await getApps.exec();
        res.status(200).send(apps);
    }
});
