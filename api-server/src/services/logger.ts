import bunyan = require("bunyan");

import * as config from "config";

export default bunyan.createLogger({
    name: config.APP_NAME,
    streams:
        config.NODE_ENV === "test"
            ? []
            : [{ level: config.LOG_LEVEL, stream: process.stdout }]
});
