import IBaseRequest from "../../IBaseRequest";
import convroute from "../convroute";

interface IRequest extends IBaseRequest {
    params: {
        groupId: string;
    };
}

export default convroute({
    path: "/groups/:groupId",
    method: "delete",
    description: "Delete group",
    tags: ["groups"],
    parameters: [
        {
            name: "groupId",
            in: "path",
            required: true,
            type: "string",
        },
    ],
    responses: {
        "204": { description: "Group deleted, returns nothing" },
        "404": { description: "Group not found" },
        "409": { description: "Group has users" },
    },
    handler: async (req: IRequest, res) => {
        const deleteGroup = req.makeUsecase("deleteGroup");
        await deleteGroup.exec(req.params.groupId);
        res.status(204).send();
    },
});
