import StaticdeployClient from "@staticdeploy/sdk";
import { randomBytes } from "crypto";
import { existsSync, readFileSync, removeSync, statSync } from "fs-extra";
import { tmpdir } from "os";
import { join, resolve } from "path";
import tar from "tar";
import { CommandModule } from "yargs";

import * as apiConfig from "../apiConfig";
import handleCommandHandlerErrors from "../handleCommandHandlerErrors";
import log from "../log";

function targzOfDir(path: string): Buffer {
    const randomString = randomBytes(8).toString("hex");
    const tmpFile = join(tmpdir(), randomString);
    tar.create({ cwd: path, file: tmpFile, sync: true }, ["."]);
    const contentTargz = readFileSync(tmpFile);
    removeSync(tmpFile);
    return contentTargz;
}

interface IArgv extends apiConfig.IApiConfig {
    from: string;
    name: string;
    tag: string;
    description: string;
}

const command: CommandModule = {
    command: "create-bundle",
    describe: "Creates a bundle and uploads it to the StaticDeploy server",
    builder: {
        ...apiConfig.builder,
        from: {
            describe: "Path of the directory to create the bundle from",
            type: "string",
            coerce: resolve,
            demandOption: true
        },
        // For some reason, when calling the following property 'name',
        // TypeScript complains about the type of property 'builder' being
        // incompatible for type CommandModule. It might be that, since builder
        // can either be an object or a function, when we give it a property
        // 'name' TypeScript thinks it's a function. To work around this issue,
        // we rename the property '_name' and alias it to 'name' (relying on
        // yargs's aliasing feature)
        // TODO: open issue on Microsoft/TypeScript
        _name: {
            alias: "name",
            describe: "Name of the bundle",
            type: "string",
            demandOption: true
        },
        tag: {
            describe: "Tag of the bundle",
            type: "string",
            demandOption: true
        },
        description: {
            describe: "Description of the bundle",
            type: "string",
            demandOption: true
        }
    },
    handler: handleCommandHandlerErrors(async (argv: IArgv) => {
        if (!existsSync(argv.from) || !statSync(argv.from).isDirectory()) {
            throw new Error(`No directory found at ${argv.from}`);
        }
        const client = new StaticdeployClient({
            apiUrl: argv.apiUrl,
            apiToken: argv.apiToken
        });
        await client.bundles.create({
            content: targzOfDir(argv.from).toString("base64"),
            name: argv.name,
            tag: argv.tag,
            description: argv.description
        });
        log.success(`created bundle ${argv.name}:${argv.tag}`);
    })
};
export default command;
