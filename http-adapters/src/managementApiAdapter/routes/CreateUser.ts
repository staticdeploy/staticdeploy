import { IUser, UserType } from "@staticdeploy/core";

import IBaseRequest from "../../IBaseRequest";
import convroute from "../convroute";

interface IRequest extends IBaseRequest {
    body: {
        idp: IUser["idp"];
        idpId: IUser["idpId"];
        type: IUser["type"];
        name: IUser["name"];
        groupsIds: string[];
    };
}

const bodySchema = {
    type: "object",
    properties: {
        idp: { type: "string" },
        idpId: { type: "string" },
        type: { type: "string", enum: [UserType.Human, UserType.Machine] },
        name: { type: "string" },
        groupsIds: { type: "array", items: { type: "string" } }
    },
    required: ["idp", "idpId", "type", "name", "groupsIds"],
    additionalProperties: false
};

export default convroute({
    path: "/users",
    method: "post",
    description: "Create a new user",
    tags: ["users"],
    parameters: [
        {
            name: "user",
            in: "body",
            required: true,
            schema: bodySchema
        }
    ],
    responses: {
        "201": { description: "User created, returns the user" },
        "404": { description: "Group(s) not found" },
        "409": {
            description: "User with same idp / idpId combination already exists"
        }
    },
    handler: async (req: IRequest, res) => {
        const createUser = req.makeUsecase("createUser");
        const createdUser = await createUser.exec(req.body);
        res.status(201).send(createdUser);
    }
});
