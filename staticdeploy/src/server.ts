import { createServer } from "http";

import usecases from "./common/usecases";
import getAuthenticationStrategies from "./components/authenticationStrategies";
import getLogger from "./components/logger";
import getStoragesModule from "./components/storagesModule";
import config from "./config";
import getExpressApp from "./getExpressApp";

(async () => {
    const logger = getLogger(config);
    const storagesModule = getStoragesModule(config, logger);
    const authenticationStrategies = getAuthenticationStrategies(
        config,
        logger
    );

    logger.debug("Current config", { config });

    try {
        const app = await getExpressApp({
            config,
            authenticationStrategies,
            storagesModule,
            usecases,
            logger
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
