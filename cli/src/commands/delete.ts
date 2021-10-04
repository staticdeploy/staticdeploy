import StaticdeployClient from "@staticdeploy/sdk";
import { resolve } from "path";
import { CommandModule } from "yargs";

import * as apiConfig from "../common/apiConfig";
import handleCommandHandlerErrors from "../common/handleCommandHandlerErrors";
import log from "../common/log";
import readStaticdeployConfig from "../common/readStaticdeployConfig";
interface IArgv extends apiConfig.IApiConfig {
    app: string;
    tag: string;
    entrypoint: string;
}

const command: CommandModule<any, any> = {
    command: "delete",
    describe: "Deletes an app and its related bundles and entrypoints",
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
                return config.delete || {};
            },
        },
        app: {
            describe: "Name of the app the entrypoint links to",
            type: "string",
            demandOption: true,
        },
        tag: {
            describe: "Tag of the bundle",
            type: "string",
            demandOption: true,
        },
    },
    handler: handleCommandHandlerErrors(async (argv: IArgv) => {
        const client = new StaticdeployClient({
            apiUrl: argv.apiUrl,
            apiToken: argv.apiToken || null,
        });

        const apps = await client.apps.getAll();
        const app = apps.find((item) => item.name === argv.app);
        const appId = String(app?.id);
        const appEntries = await client.entrypoints.getAll({ appId });

        for (const index of appEntries.keys()) {
            const element = appEntries[index];
            await client.entrypoints.delete(element.id);
        }

        await client.bundles.deleteByNameAndTag(argv.app, argv.tag);
        await client.apps.delete(appId);
        log.success(
            `app ${argv.app} along with bundle and entrypoint(s) have been deleted`
        );
    }),
};
export default command;
