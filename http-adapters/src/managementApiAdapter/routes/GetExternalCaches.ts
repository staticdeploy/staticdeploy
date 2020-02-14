import convroute from "../convroute";

export default convroute({
    path: "/externalCaches",
    method: "get",
    description: "Get all external caches",
    tags: ["externalCaches"],
    responses: {
        "200": { description: "Returns an array of all external caches" }
    },
    handler: async (req, res) => {
        const getExternalCaches = req.makeUsecase("getExternalCaches");
        const externalCaches = await getExternalCaches.exec();
        res.status(200).send(externalCaches);
    }
});
