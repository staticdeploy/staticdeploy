import convroute from "../convroute";

export default convroute({
    path: "/bundles",
    method: "get",
    description: "Get all bundles",
    tags: ["bundles"],
    responses: {
        "200": {
            description:
                "Returns an array of all bundles with only the most important inforrmation",
        },
    },
    handler: async (req, res) => {
        const getBundles = req.makeUsecase("getBundles");
        const bundles = await getBundles.exec();
        res.status(200).send(bundles);
    },
});
