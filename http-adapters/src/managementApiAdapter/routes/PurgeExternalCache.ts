import IBaseRequest from "../../IBaseRequest";
import convroute from "../convroute";

interface IRequest extends IBaseRequest {
    params: {
        externalCacheId: string;
    };
    body: string[];
}

const bodySchema = {
    type: "array",
    items: { type: "string" },
    minItems: 1
};

export default convroute({
    path: "/externalCaches/:externalCacheId",
    method: "purge",
    description: "Purges the external cache",
    tags: ["externalCaches"],
    parameters: [
        {
            name: "externalCacheId",
            in: "path",
            required: true,
            type: "string"
        },
        {
            name: "paths",
            in: "body",
            required: true,
            schema: bodySchema
        }
    ],
    responses: {
        "202": {
            description: "External cache purge command issued"
        },
        "404": { description: "External cache not found" }
    },
    handler: async (req: IRequest, res) => {
        const purgeExternalCache = req.makeUsecase("purgeExternalCache");
        await purgeExternalCache.exec(req.params.externalCacheId, req.body);
        res.status(202).send();
    }
});
