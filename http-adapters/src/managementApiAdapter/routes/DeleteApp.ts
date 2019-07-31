import IBaseRequest from "../../IBaseRequest";
import convroute from "../convroute";

interface IRequest extends IBaseRequest {
    params: {
        appId: string;
    };
}

export default convroute({
    path: "/apps/:appId",
    method: "delete",
    description: "Delete app",
    tags: ["apps"],
    parameters: [
        {
            name: "appId",
            in: "path",
            required: true,
            type: "string"
        }
    ],
    responses: {
        "204": { description: "App deleted, returns nothing" },
        "401": { description: "Authentication required" },
        "403": { description: "Missing authorization roles" },
        "404": { description: "App not found" },
        "409": { description: "App has entrypoints" }
    },
    handler: async (req: IRequest, res) => {
        const deleteApp = req.makeUsecase("deleteApp");
        await deleteApp.exec(req.params.appId);
        res.status(204).send();
    }
});
