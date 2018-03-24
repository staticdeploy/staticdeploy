import yargs = require("yargs");

import createBundle from "../commands/create-bundle";
import deploy from "../commands/deploy";

// tslint:disable-next-line:no-unused-expression
yargs
    .usage("Usage: $0 <options>")
    .env("STATICDEPLOY")
    .command(createBundle)
    .command(deploy)
    .demandCommand(1)
    .strict().argv;
