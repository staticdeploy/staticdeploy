// tslint:disable:no-console
import FormData = require("form-data");
import fs = require("fs-extra");
import yargs = require("yargs");

import defaultBuilder from "../../constants/defaultBuilder";
import sdk from "../../services/staticdeploy-sdk";

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

export const handler = (argv: yargs.Arguments): void => {
    (async () => {
        const { appIdOrName, contentPath, entrypointIdOrUrlMatcher } = argv;
        if (fs.existsSync(contentPath)) {
            const content = fs.readFileSync(contentPath).toString();
            const client = sdk(argv.apiUrl, argv.apiToken);
            const form = new FormData();
            form.append("file", content);
            await client.deployments.create({
                appIdOrName,
                entrypointIdOrUrlMatcher,
                content: form
            });
        } else {
            throw new Error("There is nothing at the specified path");
        }
    })();
};
