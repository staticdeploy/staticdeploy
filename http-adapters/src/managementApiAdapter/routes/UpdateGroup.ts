import { IGroup } from "@staticdeploy/core";

import IBaseRequest from "../../IBaseRequest";
import convroute from "../convroute";

interface IRequest extends IBaseRequest {
    params: {
        groupId: string;
    };
    body: {
        name?: IGroup["name"];
        roles?: IGroup["roles"];
    };
}

const bodySchema = {
    type: "object",
    properties: {
        name: { type: "string" },
        roles: { type: "array", items: { type: "string" } }
    },
    additionalProperties: false
};

export default convroute({
    path: "/groups/:groupId",
    method: "patch",
    description: "Update group",
    tags: ["groups"],
    parameters: [
        {
            name: "groupId",
            in: "path",
            required: true,
            type: "string"
        },
        {
            name: "patch",
            in: "body",
            required: true,
            schema: bodySchema
        }
    ],
    responses: {
        "200": { description: "Group updated, returns the group" },
        "404": { description: "Group not found" },
        "409": { description: "Group with same name already exists" }
    },
    handler: async (req: IRequest, res) => {
        const updateGroup = req.makeUsecase("updateGroup");
        const updatedGroup = await updateGroup.exec(
            req.params.groupId,
            req.body
        );
        res.status(200).send(updatedGroup);
    }
});
