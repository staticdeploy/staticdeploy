import { pathExistsSync } from "fs-extra";

import log from "./log";

export default function readStaticdeployConfig(configPath: string): any {
    // If there is no config file, return an empty config object
    if (!pathExistsSync(configPath)) {
        return {};
    }

    // Read and return the config file
    try {
        return require(configPath);
    } catch (err) {
        // On error, log the error and exit the process
        log.error(`failed reading config file ${configPath}`);
        log.error(err.message);
        log.error(err.stack);
        process.exit(1);
    }
}
