import IBaseRequest from "../../IBaseRequest";
import convroute from "../convroute";

interface IRequest extends IBaseRequest {
    params: {
        bundleId: string;
    };
}

export default convroute({
    path: "/bundles/:bundleId",
    method: "get",
    description: "Get bundle",
    tags: ["bundles"],
    parameters: [
        {
            name: "bundleId",
            in: "path",
            required: true,
            type: "string"
        }
    ],
    responses: {
        "200": { description: "Returns the bundle" },
        "404": { description: "Bundle not found" }
    },
    handler: async (req: IRequest, res) => {
        const getBundle = req.makeUsecase("getBundle");
        const bundle = await getBundle.exec(req.params.bundleId);
        res.status(200).send(bundle);
    }
});
