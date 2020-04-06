import IBaseRequest from "../../IBaseRequest";
import convroute from "../convroute";

interface IRequest extends IBaseRequest {
    params: {
        userId: string;
    };
}

export default convroute({
    path: "/users/:userId",
    method: "delete",
    description: "Delete user",
    tags: ["users"],
    parameters: [
        {
            name: "userId",
            in: "path",
            required: true,
            type: "string",
        },
    ],
    responses: {
        "204": { description: "User deleted, returns nothing" },
        "404": { description: "User not found" },
    },
    handler: async (req: IRequest, res) => {
        const deleteUser = req.makeUsecase("deleteUser");
        await deleteUser.exec(req.params.userId);
        res.status(204).send();
    },
});
