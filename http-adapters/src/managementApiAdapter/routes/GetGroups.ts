import convroute from "../convroute";

export default convroute({
    path: "/groups",
    method: "get",
    description: "Get all groups",
    tags: ["groups"],
    responses: {
        "200": { description: "Returns an array of all groups" },
    },
    handler: async (req, res) => {
        const getGroups = req.makeUsecase("getGroups");
        const groups = await getGroups.exec();
        res.status(200).send(groups);
    },
});
