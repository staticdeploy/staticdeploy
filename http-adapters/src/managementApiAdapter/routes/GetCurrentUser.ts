import convroute from "../convroute";

export default convroute({
    path: "/currentUser",
    method: "get",
    description: "Get the user performing the request",
    tags: ["users"],
    responses: {
        "200": { description: "Returns the current user" }
    },
    handler: async (req, res) => {
        const getCurrentUser = req.makeUsecase("getCurrentUser");
        const user = await getCurrentUser.exec();
        res.status(200).send(user);
    }
});
