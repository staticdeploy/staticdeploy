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
    method: "delete",
    description: "Delete all bundles with the specified name and tag",
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
        "204": {
            description: "Bundles deleted, returns nothing"
        },
        "409": {
            description:
                "Bundles can't be deleted because in use by one or more entrypoints"
        }
    },
    handler: async (req: IRequest, res) => {
        const deleteBundlesByNameAndTag = req.makeUsecase(
            "deleteBundlesByNameAndTag"
        );
        await deleteBundlesByNameAndTag.exec(
            req.params.bundleName,
            req.params.bundleTag
        );
        res.status(204).send();
    }
});
