import { IGroup } from "@staticdeploy/core";

import IBaseRequest from "../../IBaseRequest";
import convroute from "../convroute";

interface IRequest extends IBaseRequest {
    body: {
        name: IGroup["name"];
        roles: IGroup["roles"];
    };
}

const bodySchema = {
    type: "object",
    properties: {
        name: { type: "string" },
        roles: { type: "array", items: { type: "string" } },
    },
    required: ["name", "roles"],
    additionalProperties: false,
};

export default convroute({
    path: "/groups",
    method: "post",
    description: "Create a new group",
    tags: ["groups"],
    parameters: [
        {
            name: "group",
            in: "body",
            required: true,
            schema: bodySchema,
        },
    ],
    responses: {
        "201": { description: "Group created, returns the group" },
        "409": { description: "Group with same name already exists" },
    },
    handler: async (req: IRequest, res) => {
        const createGroup = req.makeUsecase("createGroup");
        const createdGroup = await createGroup.exec(req.body);
        res.status(201).send(createdGroup);
    },
});
