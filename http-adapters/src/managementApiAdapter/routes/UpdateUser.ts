import { IUser } from "@staticdeploy/core";

import IBaseRequest from "../../IBaseRequest";
import convroute from "../convroute";

interface IRequest extends IBaseRequest {
    params: {
        userId: string;
    };
    body: {
        name?: IUser["name"];
        groupsIds?: string[];
    };
}

const bodySchema = {
    type: "object",
    properties: {
        name: { type: "string" },
        groupsIds: { type: "array", items: { type: "string" } },
    },
    additionalProperties: false,
};

export default convroute({
    path: "/users/:userId",
    method: "patch",
    description: "Update user",
    tags: ["users"],
    parameters: [
        {
            name: "userId",
            in: "path",
            required: true,
            type: "string",
        },
        {
            name: "patch",
            in: "body",
            required: true,
            schema: bodySchema,
        },
    ],
    responses: {
        "200": { description: "User updated, returns the user" },
        "404": { description: "User or group(s) not found" },
    },
    handler: async (req: IRequest, res) => {
        const updateUser = req.makeUsecase("updateUser");
        const updatedUser = await updateUser.exec(req.params.userId, req.body);
        res.status(200).send(updatedUser);
    },
});
