import IBaseRequest from "../../IBaseRequest";
import convroute from "../convroute";

interface IRequest extends IBaseRequest {
    query: {
        appId: string;
    };
}

export default convroute({
    path: "/entrypoints",
    method: "get",
    description: "Get all entrypoints with the specified appId",
    tags: ["entrypoints"],
    parameters: [
        {
            name: "appId",
            in: "query",
            required: true,
            type: "string",
        },
    ],
    responses: {
        "200": { description: "Returns an array of all entrypoints" },
        "404": { description: "Filter app not found" },
    },
    handler: async (req: IRequest, res) => {
        const getEntrypointsByAppId = req.makeUsecase("getEntrypointsByAppId");
        const entrypoints = await getEntrypointsByAppId.exec(req.query.appId);
        res.status(200).send(entrypoints);
    },
});
