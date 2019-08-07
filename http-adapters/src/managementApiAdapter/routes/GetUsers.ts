import convroute from "../convroute";

export default convroute({
    path: "/users",
    method: "get",
    description: "Get all users",
    tags: ["users"],
    responses: {
        "200": { description: "Returns an array of all users" }
    },
    handler: async (req, res) => {
        const getUsers = req.makeUsecase("getUsers");
        const users = await getUsers.exec();
        res.status(200).send(users);
    }
});
