import StaticdeployClient from "@staticdeploy/sdk";
import { CommandModule } from "yargs";

import * as apiConfig from "../apiConfig";
import handleCommandHandlerErrors from "../handleCommandHandlerErrors";
import log from "../log";

interface IArgv extends apiConfig.IApiConfig {
    app: string;
    entrypoint: string;
    bundle: string;
}

const command: CommandModule = {
    command: "deploy",
    describe: "Deploys a bundle to an entrypoint",
    builder: {
        ...apiConfig.builder,
        app: {
            describe: "Name of the app the entrypoint links to",
            type: "string",
            demandOption: true
        },
        entrypoint: {
            describe: "urlMatcher of the entrypoint to deploy to",
            type: "string",
            demandOption: true
        },
        bundle: {
            describe: "name:tag combination of the bundle to deploy",
            type: "string",
            demandOption: true
        }
    },
    handler: handleCommandHandlerErrors(async (argv: IArgv) => {
        const client = new StaticdeployClient({
            apiUrl: argv.apiUrl,
            apiToken: argv.apiToken
        });

        await client.deploy({
            appName: argv.app,
            entrypointUrlMatcher: argv.entrypoint,
            bundleNameTagCombination: argv.bundle
        });

        log.success(
            `bundle ${argv.bundle} deployed to entrypoint ${argv.entrypoint}`
        );
    })
};
export default command;
