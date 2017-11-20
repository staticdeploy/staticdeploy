import { createServer } from "http";

import * as config from "config";
import getApp from "getApp";
import logger from "services/logger";

logger.debug("Server config", { config });

(async () => {
    const app = await getApp();
    createServer()
        .on("request", app)
        .listen(config.PORT, () => {
            logger.info(
                `Server listening on ${config.HOSTNAME}:${config.PORT}`
            );
        });
})();
