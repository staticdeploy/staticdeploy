import IBaseRequest from "../../IBaseRequest";
import convroute from "../convroute";

interface IRequest extends IBaseRequest {
    params: {
        userId: string;
    };
}

export default convroute({
    path: "/users/:userId",
    method: "get",
    description: "Get user",
    tags: ["users"],
    parameters: [
        {
            name: "userId",
            in: "path",
            required: true,
            type: "string"
        }
    ],
    responses: {
        "200": { description: "Returns the user" },
        "404": { description: "User not found" }
    },
    handler: async (req: IRequest, res) => {
        const getUser = req.makeUsecase("getUser");
        const user = await getUser.exec(req.params.userId);
        res.status(200).send(user);
    }
});
