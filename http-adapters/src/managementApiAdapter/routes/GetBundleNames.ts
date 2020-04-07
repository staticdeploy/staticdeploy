import convroute from "../convroute";

export default convroute({
    path: "/bundleNames",
    method: "get",
    description: "Get all bundle names",
    tags: ["bundles"],
    responses: {
        "200": { description: "Returns an array of bundle names" },
    },
    handler: async (req, res) => {
        const getBundleNames = req.makeUsecase("getBundleNames");
        const bundleNames = await getBundleNames.exec();
        res.status(200).send(bundleNames);
    },
});
