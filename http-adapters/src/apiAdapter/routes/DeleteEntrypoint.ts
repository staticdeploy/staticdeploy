import IBaseRequest from "../../IBaseRequest";
import convroute from "../convroute";

interface IRequest extends IBaseRequest {
    params: {
        entrypointId: string;
    };
}

export default convroute({
    path: "/entrypoints/:entrypointId",
    method: "delete",
    description: "Delete entrypoint",
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
        "204": { description: "Entrypoint deleted, returns nothing" },
        "401": { description: "Authentication required" },
        "404": { description: "Entrypoint not found" }
    },
    handler: async (req: IRequest, res) => {
        const deleteEntrypoint = req.makeUsecase("deleteEntrypoint");
        await deleteEntrypoint.exec(req.params.entrypointId);
        res.status(204).send();
    }
});
