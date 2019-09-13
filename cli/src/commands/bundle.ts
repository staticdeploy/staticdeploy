import StaticdeployClient from "@staticdeploy/sdk";
import tarArchiver from "@staticdeploy/tar-archiver";
import { pathExistsSync, statSync } from "fs-extra";
import { join, resolve } from "path";
import { CommandModule } from "yargs";

import * as apiConfig from "../common/apiConfig";
import handleCommandHandlerErrors from "../common/handleCommandHandlerErrors";
import log from "../common/log";
import readStaticdeployConfig from "../common/readStaticdeployConfig";

interface IArgv extends apiConfig.IApiConfig {
    from: string;
    name: string;
    tag: string;
    description: string;
    fallbackAssetPath: string;
    fallbackStatusCode: number;
    // The headers string is a JSON of an object with structure:
    // {
    //     [assetMatcher: string]: {
    //         [headerName: string]: string;
    //     };
    // }
    headers: string;
}

const command: CommandModule<any, any> = {
    command: "bundle",
    describe: "Creates a bundle and uploads it to the StaticDeploy server",
    builder: {
        ...apiConfig.builder,
        config: {
            coerce: resolve,
            config: true,
            default: "staticdeploy.config.js",
            configParser: (configPath: string) => {
                // Read the config file
                const config = readStaticdeployConfig(configPath);

                // Return the bundle config, defaulting to an empty object
                return config.bundle
                    ? {
                          ...config.bundle,
                          // headers is expected by yargs to be a string, but
                          // it's an object when specified in the config file.
                          // We need to stringify the object before passing it
                          // to yargs, otherwise yargs transforms it in a way
                          // that makes it invalid (see staticdeploy issue #24)
                          headers: config.bundle.headers
                              ? JSON.stringify(config.bundle.headers)
                              : "{}"
                      }
                    : {};
            }
        },
        from: {
            describe: "Path of the directory to create the bundle from",
            type: "string",
            coerce: resolve,
            demandOption: true
        },
        name: {
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
        },
        fallbackAssetPath: {
            describe:
                "Absolute path (relative to the 'from' directory) of the asset to use as fallback when requests don't match any other asset. Defaults to `/index.html`, but the asset MUST exist",
            type: "string",
            default: "/index.html"
        },
        fallbackStatusCode: {
            describe: "Status code to use when serving the fallback asset",
            type: "number",
            default: 200
        },
        headers: {
            describe:
                "(asset matcher, headers) map specifying which headers to assign to which assets",
            type: "string",
            default: "{}"
        }
    },
    handler: handleCommandHandlerErrors(async (argv: IArgv) => {
        // Ensure the 'from' directory exists
        if (!pathExistsSync(argv.from) || !statSync(argv.from).isDirectory()) {
            throw new Error(`No directory found at ${argv.from}`);
        }

        // Ensure fallbackAssetPath points to an existing asset
        const fallbackAssetLocalPath = join(argv.from, argv.fallbackAssetPath);
        if (
            !pathExistsSync(fallbackAssetLocalPath) ||
            !statSync(fallbackAssetLocalPath).isFile()
        ) {
            throw new Error(
                `File ${fallbackAssetLocalPath} not found, ${argv.fallbackAssetPath} cannot be set as fallbackAssetPath`
            );
        }

        const client = new StaticdeployClient({
            apiUrl: argv.apiUrl,
            apiToken: argv.apiToken || null
        });

        await client.bundles.create({
            content: (await tarArchiver.makeArchiveFromPath(
                argv.from
            )).toString("base64"),
            name: argv.name,
            tag: argv.tag,
            description: argv.description,
            fallbackAssetPath: argv.fallbackAssetPath,
            fallbackStatusCode: argv.fallbackStatusCode,
            // Parse the object here instead of specifying a coerce function for
            // the option to avoid yargs transforming the parsed object
            // (staticdeploy issue #24)
            // TODO: verify whether yargs behaviour is intended or not and - if
            // not - open an issue
            headers: JSON.parse(argv.headers)
        });

        log.success(`created bundle ${argv.name}:${argv.tag}`);
    })
};
export default command;
