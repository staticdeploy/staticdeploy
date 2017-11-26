import { Request } from "express";

import convroute from "common/convroute";
import * as schemas from "common/schemas";
import App from "models/App";
import Deployment from "models/Deployment";
import Entrypoint from "models/Entrypoint";

interface IRequest extends Request {
    params: {
        entrypointId: string;
    };
    body: {
        appId?: Entrypoint["appId"];
        urlMatcher?: Entrypoint["urlMatcher"];
        urlMatcherPriority?: Entrypoint["urlMatcherPriority"];
        smartRoutingEnabled?: Entrypoint["smartRoutingEnabled"];
        activeDeploymentId?: Entrypoint["activeDeploymentId"];
        configuration?: Entrypoint["configuration"] | null;
    };
}

const bodySchema = {
    type: "object",
    properties: {
        appId: {
            type: "string"
        },
        urlMatcher: {
            type: "string"
        },
        urlMatcherPriority: {
            type: "number"
        },
        smartRoutingEnabled: {
            type: "boolean"
        },
        activeDeploymentId: {
            type: "string"
        },
        configuration: {
            $oneOf: [schemas.configuration, { type: "null" }]
        }
    },
    additionalProperties: false
};

export default convroute({
    path: "/entrypoints/:entrypointId",
    method: "patch",
    description: "Update entrypoint",
    tags: ["entrypoints"],
    parameters: [
        {
            name: "entrypointId",
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
        "200": { description: "Entrypoint updated, returns the entrypoint" },
        "400": { description: "Patch validation failed" },
        "404": {
            description:
                "Entrypoint, linked app, or linked deployment not found"
        },
        "409": { description: "Entrypoint with same urlMatcher already exists" }
    },
    handler: async (req: IRequest, res) => {
        const { entrypointId } = req.params;
        const patch = req.body;

        // Find the entrypoint
        const entrypoint = await Entrypoint.findById(entrypointId);

        // Ensure the entrypoint exists
        if (!entrypoint) {
            res.status(404).send({
                message: `No entrypoint found with id = ${entrypointId}`
            });
            return;
        }

        // Ensure the linked app exists
        if (patch.appId) {
            const linkedApp = await App.findById(patch.appId);
            if (!linkedApp) {
                res.status(404).send({
                    message: `No app found with id = ${patch.appId}`
                });
                return;
            }
        }

        // Ensure the linked deployment exists
        if (patch.activeDeploymentId) {
            const linkedDeployment = await Deployment.findById(
                patch.activeDeploymentId
            );
            if (!linkedDeployment) {
                res.status(404).send({
                    message: `No deployment found with id = ${
                        patch.activeDeploymentId
                    }`
                });
                return;
            }
        }

        // Ensure no entrypoint with the same urlMatcher exists
        if (patch.urlMatcher) {
            const conflictingEntrypoint = await Entrypoint.findOne({
                where: { urlMatcher: patch.urlMatcher }
            });
            if (
                conflictingEntrypoint &&
                conflictingEntrypoint.id !== entrypoint.id
            ) {
                res.status(409).send({
                    message: `An entrypoint with urlMatcher = ${
                        patch.urlMatcher
                    } already exists`
                });
                return;
            }
        }

        // Update the entrypoint
        await entrypoint.update(patch);

        // Respond to the client
        res.status(200).send(entrypoint);
    }
});
