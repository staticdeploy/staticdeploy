import convroute from "../convroute";

export default convroute({
    path: "/supportedExternalCacheTypes",
    method: "get",
    description: "Get all supported external cache type",
    tags: ["externalCaches"],
    responses: {
        "200": {
            description:
                "Returns an array of all supported external cache types"
        }
    },
    handler: async (req, res) => {
        const getSupportedExternalCacheTypes = req.makeUsecase(
            "getSupportedExternalCacheTypes"
        );
        const externalCacheTypes = await getSupportedExternalCacheTypes.exec();
        res.status(200).send(externalCacheTypes);
    }
});
