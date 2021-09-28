import yargs = require("yargs");

import bundle from "./commands/bundle";
import deploy from "./commands/deploy";
import del from "./commands/delete";

yargs
    .usage("Usage: $0 <options>")
    .env("STATICDEPLOY")
    .command(bundle)
    .command(deploy)
    .command(del)
    .demandCommand(1)
    .strict()
    .parse();
