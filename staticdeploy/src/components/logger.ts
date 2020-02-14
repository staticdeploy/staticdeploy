import SimpleJsonLogger from "@staticdeploy/simple-json-logger";

import IConfig from "../common/IConfig";

export default (config: IConfig): SimpleJsonLogger =>
    new SimpleJsonLogger(config.nodeEnv !== "test" ? process.stdout : null);
