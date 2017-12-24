import { IApp, IEntrypoint } from "@staticdeploy/storage";
import { Request } from "express";

import convroute from "common/convroute";
import storage from "services/storage";

interface IRequest extends Request {
    body: {
        appIdOrName?: IApp["id"] | IApp["name"];
        entrypointIdOrUrlMatcher: IEntrypoint["id"] | IEntrypoint["urlMatcher"];
        description?: string;
        content: string;
    };
}

const bodySchema = {
    type: "object",
    properties: {
        appIdOrName: {
            type: "string"
        },
        entrypointIdOrUrlMatcher: {
            type: "string"
        },
        description: {
            type: "string"
        },
        content: {
            type: "string"
        }
    },
    required: ["entrypointIdOrUrlMatcher", "content"],
    additionalProperties: false
};

export default convroute({
    path: "/deployments",
    method: "post",
    description: "Create new deployment",
    tags: ["deployments"],
    parameters: [
        {
            name: "deployment",
            in: "body",
            required: true,
            schema: bodySchema
        }
    ],
    responses: {
        "201": { description: "Deployment created, returns the deployment" },
        "400": { description: "Body validation failed" }
    },
    handler: async (req: IRequest, res) => {
        const partial = req.body;

        // Find linked entrypoint
        let linkedEntrypoint = await storage.entrypoints.findOneByIdOrUrlMatcher(
            partial.entrypointIdOrUrlMatcher
        );

        // Create entrypoint if doesn't exist
        if (!linkedEntrypoint) {
            if (!partial.appIdOrName) {
                res.status(404).send({
                    message: `No entrypoint found with id or urlMatcher = ${
                        partial.entrypointIdOrUrlMatcher
                    }`
                });
                return;
            }
            let linkedApp = await storage.apps.findOneByIdOrName(
                partial.appIdOrName
            );

            // Create app if it doesn't exist
            if (!linkedApp) {
                linkedApp = await storage.apps.create({
                    name: partial.appIdOrName
                });
            }

            linkedEntrypoint = await storage.entrypoints.create({
                appId: linkedApp.id,
                urlMatcher: partial.entrypointIdOrUrlMatcher
            });
        }

        // Create the deployment
        const deployment = await storage.deployments.create({
            entrypointId: linkedEntrypoint.id,
            description: partial.description,
            content: Buffer.from(partial.content, "base64")
        });

        // Set the deployment as active for the linked entrypoint
        await storage.entrypoints.update(linkedEntrypoint.id, {
            activeDeploymentId: deployment.id
        });

        // Respond to the client
        res.status(201).send(deployment);
    }
});
