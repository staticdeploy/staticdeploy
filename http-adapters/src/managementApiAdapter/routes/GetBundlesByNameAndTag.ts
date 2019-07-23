import IBaseRequest from "../../IBaseRequest";
import convroute from "../convroute";

interface IRequest extends IBaseRequest {
    params: {
        bundleName: string;
        bundleTag: string;
    };
}

export default convroute({
    path: "/bundleNames/:bundleName/bundleTags/:bundleTag/bundles",
    method: "get",
    description: "Get all bundles with the specified name and tag",
    tags: ["bundles"],
    parameters: [
        {
            name: "bundleName",
            in: "path",
            required: true,
            type: "string"
        },
        {
            name: "bundleTag",
            in: "path",
            required: true,
            type: "string"
        }
    ],
    responses: {
        "200": {
            description:
                "Returns an array of bundles with the specified name and tag"
        },
        "401": { description: "Authentication required" }
    },
    handler: async (req: IRequest, res) => {
        const getBundlesByNameAndTag = req.makeUsecase(
            "getBundlesByNameAndTag"
        );
        const bundles = await getBundlesByNameAndTag.exec(
            req.params.bundleName,
            req.params.bundleTag
        );
        res.status(200).send(bundles);
    }
});
