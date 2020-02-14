import IBaseRequest from "../../IBaseRequest";
import convroute from "../convroute";

interface IRequest extends IBaseRequest {
    params: {
        externalCacheId: string;
    };
}

export default convroute({
    path: "/externalCaches/:externalCacheId",
    method: "get",
    description: "Get external cache",
    tags: ["externalCaches"],
    parameters: [
        {
            name: "externalCacheId",
            in: "path",
            required: true,
            type: "string"
        }
    ],
    responses: {
        "200": { description: "Returns the external cache" },
        "404": { description: "External cache not found" }
    },
    handler: async (req: IRequest, res) => {
        const getExternalCache = req.makeUsecase("getExternalCache");
        const externalCache = await getExternalCache.exec(
            req.params.externalCacheId
        );
        res.status(200).send(externalCache);
    }
});
