import convroute from "common/convroute";
import IBaseRequest from "common/IBaseRequest";
import storage from "services/storage";

interface IRequest extends IBaseRequest {
    params: {
        bundleName: string;
    };
}

export default convroute({
    path: "/bundleNames/:bundleName/bundleTags",
    method: "get",
    description: "Get all tags of bundles with the specified name",
    tags: ["bundles"],
    responses: {
        "200": { description: "Returns an array of bundle tags" }
    },
    handler: async (req: IRequest, res) => {
        const bundleTags = await storage.bundles.findTagsByName(
            req.params.bundleName
        );

        res.status(200).send(bundleTags);
    }
});
