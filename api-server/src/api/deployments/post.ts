import * as child_process from "child_process";
import { Request } from "express";
import * as fs from "fs";
import * as path from "path";
import { Sequelize } from "sequelize-typescript";
import * as util from "util";

import convroute from "common/convroute";
import generateId from "common/generateId";
import withTransaction from "common/withTransaction";
import * as config from "config";
import App from "models/App";
import Deployment from "models/Deployment";
import Entrypoint from "models/Entrypoint";

const exec = util.promisify(child_process.exec);
const writeFile = util.promisify(fs.writeFile);

interface IRequest extends Request {
    body: {
        appIdOrName?: App["id"] | App["name"];
        entrypointIdOrUrlMatcher: Entrypoint["id"] | Entrypoint["urlMatcher"];
        description?: Deployment["description"];
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
    handler: withTransaction(async (req: IRequest, res, transaction) => {
        const { body } = req;

        // Find linked entrypoint
        let linkedEntrypoint = await Entrypoint.findOne({
            where: Sequelize.or(
                { id: body.entrypointIdOrUrlMatcher },
                { urlMatcher: body.entrypointIdOrUrlMatcher }
            )
        });

        // Create entrypoint if doesn't exist
        if (!linkedEntrypoint) {
            if (!body.appIdOrName) {
                res.status(400).send({
                    message:
                        "Linked entrypoint doesn't exist, you must specify an appIdOrName for it to be created automatically"
                });
                return;
            }
            let linkedApp = await App.findOne({
                where: Sequelize.or(
                    { id: body.appIdOrName },
                    { name: body.appIdOrName }
                )
            });

            // Create app if it doesn't exist
            if (!linkedApp) {
                linkedApp = await App.create(
                    {
                        id: generateId(),
                        name: body.appIdOrName
                    },
                    { transaction }
                );
            }

            linkedEntrypoint = await Entrypoint.create(
                {
                    id: generateId(),
                    appId: linkedApp.id,
                    urlMatcher: body.entrypointIdOrUrlMatcher
                },
                { transaction }
            );
        }

        // Create the deployment
        const deployment = await Entrypoint.create(
            {
                id: generateId(),
                entrypointId: linkedEntrypoint.id,
                description: body.description
            },
            { transaction }
        );

        // Unpack the deployment content
        const targz = Buffer.from(body.content, "base64");
        const targzPath = path.join(
            config.DEPLOYMENTS_PATH,
            deployment.id,
            ".tar.gz"
        );
        await writeFile(targzPath, targz);
        await exec(`tar -xzf ${targzPath}`, { cwd: config.DEPLOYMENTS_PATH });

        // Set the deployment as active for the linked entrypoint
        await linkedEntrypoint.update(
            {
                activeDeploymentId: deployment.id
            },
            { transaction }
        );

        // Commit the transaction
        await transaction.commit();

        // Respond to the client
        res.status(201).send(deployment);
    })
});
