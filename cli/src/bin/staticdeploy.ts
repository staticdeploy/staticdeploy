import yargs = require("yargs");

import deploy from "../commands/deploy";

// tslint:disable-next-line:no-unused-expression
yargs
    .usage("Usage: $0 <options>")
    .env("STATICDEPLOY")
    .command(deploy)
    .demandCommand(1)
    .strict().argv;
