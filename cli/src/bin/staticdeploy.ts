// tslint:disable:no-console
import findUp = require("find-up");
import fs = require("fs-extra");
import yargs = require("yargs");

export interface IArgv extends yargs.Arguments {
    apiUrl: string | void;
    apiToken: string | void;
}

const configPath: string | null = findUp.sync([".staticdeployrc"]);
const config: object = configPath ? fs.readJsonSync(configPath) : {};

const argv = yargs
    .usage("Usage: $0 <options>")
    .config(config)
    .commandDir("../commands")
    .demandCommand(1)
    .env("STATICDEPLOY")
    .strict().argv as IArgv;

console.log("argv", argv);
