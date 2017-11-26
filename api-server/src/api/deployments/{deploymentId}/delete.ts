import { Request } from "express";

import convroute from "common/convroute";
import Deployment from "models/Deployment";

interface IRequest extends Request {
    params: {
        deploymentId: string;
    };
}

export default convroute({
    path: "/deploymenty/:deploymentId",
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
        const { deploymentId } = req.params;

        // Find the deployment
        const deployment = await Deployment.findById(deploymentId);

        // Ensure the deployment exists
        if (!deployment) {
            res.status(404).send({
                message: `No deployment found with id = ${deploymentId}`
            });
            return;
        }

        // Delete the deployment
        await deployment.destroy();

        // Respond to the client
        res.status(204).send();
    }
});
