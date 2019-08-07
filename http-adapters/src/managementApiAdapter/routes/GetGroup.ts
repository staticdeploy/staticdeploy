import IBaseRequest from "../../IBaseRequest";
import convroute from "../convroute";

interface IRequest extends IBaseRequest {
    params: {
        groupId: string;
    };
}

export default convroute({
    path: "/groups/:groupId",
    method: "get",
    description: "Get group",
    tags: ["groups"],
    parameters: [
        {
            name: "groupId",
            in: "path",
            required: true,
            type: "string"
        }
    ],
    responses: {
        "200": { description: "Returns the group" },
        "404": { description: "Group not found" }
    },
    handler: async (req: IRequest, res) => {
        const getGroup = req.makeUsecase("getGroup");
        const group = await getGroup.exec(req.params.groupId);
        res.status(200).send(group);
    }
});
