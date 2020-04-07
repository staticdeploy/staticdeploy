import IBaseRequest from "../../IBaseRequest";
import convroute from "../convroute";

interface IRequest extends IBaseRequest {
    params: {
        appId: string;
    };
}

export default convroute({
    path: "/apps/:appId",
    method: "get",
    description: "Get app",
    tags: ["apps"],
    parameters: [
        {
            name: "appId",
            in: "path",
            required: true,
            type: "string",
        },
    ],
    responses: {
        "200": { description: "Returns the app" },
        "404": { description: "App not found" },
    },
    handler: async (req: IRequest, res) => {
        const getApp = req.makeUsecase("getApp");
        const app = await getApp.exec(req.params.appId);
        res.status(200).send(app);
    },
});
