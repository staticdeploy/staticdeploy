import StaticdeployClient from "@staticdeploy/sdk";
import { randomBytes } from "crypto";
import { existsSync, readFileSync, removeSync, statSync } from "fs-extra";
import { tmpdir } from "os";
import { join, resolve } from "path";
import tar = require("tar");
import { CommandModule } from "yargs";

import * as apiConfig from "../apiConfig";

function targzOfDir(path: string): Buffer {
    const randomString = randomBytes(8).toString("hex");
    const tmpFile = join(tmpdir(), randomString);
    tar.create({ cwd: path, file: tmpFile, sync: true }, ["."]);
    const contentTargz = readFileSync(tmpFile);
    removeSync(tmpFile);
    return contentTargz;
}

interface IArgv extends apiConfig.IApiConfig {
    target: string;
    entrypoint: string;
    app?: string;
    description?: string;
}

const command: CommandModule = {
    command: "deploy",
    describe: "Deploys a directory to the specified entrypoint",
    builder: {
        ...apiConfig.builder,
        target: {
            describe: "Path of the directory to deploy",
            type: "string",
            coerce: resolve,
            demandOption: true
        },
        entrypoint: {
            describe: "Id or url of the entrypoint to deploy to",
            type: "string",
            demandOption: true
        },
        app: {
            describe: "Id or name of the app to deploy to",
            type: "string"
        },
        description: {
            describe: "Description for the deployment",
            type: "string"
        }
    },
    handler: async (argv: IArgv) => {
        if (!existsSync(argv.target) || !statSync(argv.target).isDirectory()) {
            throw new Error(`No directory found at ${argv.target}`);
        }
        const client = new StaticdeployClient({
            apiUrl: argv.apiUrl,
            apiToken: argv.apiToken
        });
        await client.deployments.create({
            content: targzOfDir(argv.target).toString("base64"),
            entrypointIdOrUrlMatcher: argv.entrypoint,
            appIdOrName: argv.app,
            description: argv.description
        });
    }
};
export default command;
