import yargs = require("yargs");

import bundle from "./commands/bundle";
import deploy from "./commands/deploy";

yargs
    .usage("Usage: $0 <options>")
    .env("STATICDEPLOY")
    .command(bundle)
    .command(deploy)
    .demandCommand(1)
    .strict()
    .parse();
