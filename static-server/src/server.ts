import { createServer } from "http";

import * as config from "config";
import getApp from "getApp";
import logger from "services/logger";

logger.debug("Server config", { config });

(async () => {
    try {
        const app = await getApp(config);
        createServer()
            .on("request", app)
            .listen(config.PORT, () => {
                logger.info(`Server listening on port ${config.PORT}`);
            });
    } catch (err) {
        logger.error(err, "Error bootstrapping app");
        process.exit(1);
    }
})();
