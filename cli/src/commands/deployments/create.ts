// tslint:disable:no-console
import StaticdeployClient from "@staticdeploy/sdk";
import fs = require("fs-extra");
import yargs = require("yargs");

import defaultBuilder from "../../constants/defaultBuilder";

export const command = "create";
export const describe = "Create deployment";
export const builder = {
    ...defaultBuilder,
    appIdOrName: {
        describe: "Id or name of the app to deploy the deployment",
        type: "string"
    },
    contentPath: {
        describe: "Path of the content to upload",
        type: "string",
        demandOption: true
    },
    description: {
        describe: "Description to the content to deploy",
        type: "string"
    },
    entrypointIdOrUrlMatcher: {
        describe: "Id or url of the entrypoint where you want to deploy",
        type: "string",
        demandOption: true
    }
};

export interface IDeployment {
    id: string;
    entrypointId: string;
}

export async function handler(argv: yargs.Arguments): Promise<IDeployment> {
    const {
        appIdOrName,
        contentPath,
        entrypointIdOrUrlMatcher,
        description
    } = argv;
    if (!fs.existsSync(contentPath)) {
        throw new Error("There is nothing at the specified path");
    }
    if (!fs.statSync(contentPath).isFile()) {
        throw new Error(
            "There is a folder at the specified path, please insert a path to a file"
        );
    }
    const content = fs.readFileSync(contentPath, { encoding: "base64" });
    const client = new StaticdeployClient({
        apiUrl: argv.apiUrl,
        apiToken: argv.apiToken
    });
    return client.deployments.create({
        appIdOrName,
        entrypointIdOrUrlMatcher,
        content,
        description
    });
}
