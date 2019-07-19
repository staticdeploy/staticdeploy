import { createServer } from "http";

import usecases from "./common/usecases";
import config from "./config";
import getExpressApp from "./getExpressApp";
import getLogger from "./services/logger";
import getStoragesModule from "./services/storagesModule";

(async () => {
    const logger = getLogger(config);
    const storagesModule = getStoragesModule(config, logger);

    logger.debug("Current config", { config });

    try {
        const app = await getExpressApp({
            config: config,
            storagesModule: storagesModule,
            usecases: usecases,
            logger: logger
        });
        createServer()
            .on("request", app)
            .listen(config.port, () => {
                logger.info(`Server listening on port ${config.port}`);
            });
    } catch (err) {
        logger.error(err, "Error boostrapping server");
        process.exit(1);
    }
})();
