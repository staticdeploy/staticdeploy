import StaticdeployClient from "@staticdeploy/sdk";
import { resolve } from "path";
import { CommandModule } from "yargs";

import * as apiConfig from "../common/apiConfig";
import handleCommandHandlerErrors from "../common/handleCommandHandlerErrors";
import log from "../common/log";
import readStaticdeployConfig from "../common/readStaticdeployConfig";

interface IArgv extends apiConfig.IApiConfig {
    app: string;
    entrypoint: string;
    bundle: string;
}

const command: CommandModule<any, any> = {
    command: "deploy",
    describe: "Deploys a bundle to an entrypoint",
    builder: {
        ...apiConfig.builder,
        config: {
            coerce: resolve,
            config: true,
            default: "staticdeploy.config.js",
            configParser: (configPath: string) => {
                // Read the config file
                const config = readStaticdeployConfig(configPath);

                // Return the deploy config, defaulting to an empty object
                return config.deploy || {};
            }
        },
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
