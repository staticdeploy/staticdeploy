import IBaseRequest from "../../IBaseRequest";
import convroute from "../convroute";

interface IRequest extends IBaseRequest {
    params: {
        externalCacheId: string;
    };
}

export default convroute({
    path: "/externalCaches/:externalCacheId",
    method: "delete",
    description: "Delete external cache",
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
        "204": { description: "External cache deleted, returns nothing" },
        "404": { description: "External cache not found" }
    },
    handler: async (req: IRequest, res) => {
        const deleteExternalCache = req.makeUsecase("deleteExternalCache");
        await deleteExternalCache.exec(req.params.externalCacheId);
        res.status(204).send();
    }
});
