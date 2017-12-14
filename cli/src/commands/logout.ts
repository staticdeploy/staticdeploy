// tslint:disable:no-console
import findUp = require("find-up");
import fs = require("fs-extra");

import { IArgv } from "../bin/staticdeploy";

export const command = "logout";
export const describe = "Remove .staticdeployrc file";
export const builder = {
    apiUrl: {
        describe: "Api server url",
        type: "string"
    },
    apiToken: {
        describe: "Api server auth token",
        type: "string"
    }
};

export const handler = (argv: IArgv) => {
    const configPath = findUp.sync([".staticdeployrc"]);
    if (configPath) {
        fs.removeSync(configPath);
        argv.apiToken = undefined;
        argv.apiUrl = undefined;
    }
};
