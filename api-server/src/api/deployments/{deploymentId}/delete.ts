import { Request } from "express";

import convroute from "common/convroute";
import storage from "services/storage";

interface IRequest extends Request {
    params: {
        deploymentId: string;
    };
}

export default convroute({
    path: "/deployments/:deploymentId",
    method: "delete",
    description: "Delete deployment",
    tags: ["deployments"],
    parameters: [
        {
            name: "deploymentId",
            in: "path",
            required: true,
            type: "string"
        }
    ],
    responses: {
        "204": { description: "Deployment deleted, returns nothing" },
        "404": { description: "Deployment not found" }
    },
    handler: async (req: IRequest, res) => {
        await storage.deployments.delete(req.params.deploymentId);
        res.status(204).send();
    }
});
