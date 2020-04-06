import Logger from "bunyan";

import IConfig from "../common/IConfig";

export default (config: IConfig): Logger =>
    Logger.createLogger({
        name: config.appName,
        streams:
            config.nodeEnv === "test"
                ? []
                : [{ level: config.logLevel, stream: process.stdout }],
    });
