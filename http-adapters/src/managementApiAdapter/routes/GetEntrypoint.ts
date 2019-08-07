import IBaseRequest from "../../IBaseRequest";
import convroute from "../convroute";

interface IRequest extends IBaseRequest {
    params: {
        entrypointId: string;
    };
}

export default convroute({
    path: "/entrypoints/:entrypointId",
    method: "get",
    description: "Get entrypoint",
    tags: ["entrypoints"],
    parameters: [
        {
            name: "entrypointId",
            in: "path",
            required: true,
            type: "string"
        }
    ],
    responses: {
        "200": { description: "Returns the entrypoint" },
        "404": { description: "Entrypoint not found" }
    },
    handler: async (req: IRequest, res) => {
        const getEntrypoint = req.makeUsecase("getEntrypoint");
        const entrypoint = await getEntrypoint.exec(req.params.entrypointId);
        res.status(200).send(entrypoint);
    }
});
