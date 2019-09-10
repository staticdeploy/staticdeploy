import IBaseRequest from "../../IBaseRequest";
import convroute from "../convroute";

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
    parameters: [
        {
            name: "bundleName",
            in: "path",
            required: true,
            type: "string"
        }
    ],
    responses: {
        "200": { description: "Returns an array of bundle tags" }
    },
    handler: async (req: IRequest, res) => {
        const getBundleTagsByBundleName = req.makeUsecase(
            "getBundleTagsByBundleName"
        );
        const bundleTags = await getBundleTagsByBundleName.exec(
            req.params.bundleName
        );
        res.status(200).send(bundleTags);
    }
});
