// tslint:disable:no-console
import fs = require("fs-extra");
import os = require("os");
import yargs = require("yargs");

import defaultBuilder = require("../constants/defaultBuilder");

export const command = "login";
export const describe =
    "Set the staticdeploy credentials in a .staticdeployrc file inside home directory";
export const builder = defaultBuilder.default;

export const handler = (argv: yargs.Arguments): void => {
    fs.outputJsonSync(
        `${os.homedir()}/.staticdeployrc`,
        {
            apiUrl: argv.apiUrl,
            apiToken: argv.apiToken
        },
        { spaces: 4 }
    );
};
