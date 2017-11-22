// tslint:disable:no-console
import yargs = require("yargs");

interface IArgv extends yargs.Arguments {
    apiUrl: string;
    apiToken: string;
}

const argv = yargs
    .usage("Usage: $0 <options>")
    .env("STATICDEPLOY")
    .option("apiUrl", {
        default: "http://localhost:3000",
        describe: "Api server url",
        type: "string"
    })
    .option("apiToken", {
        describe: "Api server auth token",
        type: "string",
        demandOption: true
    })
    .strict().argv as IArgv;

console.log(argv);
