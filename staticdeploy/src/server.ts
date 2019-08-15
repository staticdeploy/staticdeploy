import { createServer } from "http";

import usecases from "./common/usecases";
import getAuthenticationStrategies from "./components/authenticationStrategies";
import getExpressApp from "./components/expressApp";
import getLogger from "./components/logger";
import getManagementRouter from "./components/managementRouter";
import getStoragesModule from "./components/storagesModule";
import config from "./config";
import createRootUserAndGroup from "./init/createRootUserAndGroup";
import setupAuthenticationStrategies from "./init/setupAuthenticationStrategies";
import setupStorages from "./init/setupStorages";

(async () => {
    // Initialize components
    const logger = getLogger(config);
    const authenticationStrategies = getAuthenticationStrategies(
        config,
        logger
    );
    const managementRouter = await getManagementRouter(config);
    const storagesModule = getStoragesModule(config, logger);
    const expressApp = getExpressApp({
        config,
        authenticationStrategies,
        logger,
        managementRouter,
        storagesModule,
        usecases
    });

    // Run init functions
    await setupAuthenticationStrategies(authenticationStrategies);
    await setupStorages(storagesModule);
    await createRootUserAndGroup(config, storagesModule.getStorages());

    // Start the http server
    try {
        createServer()
            .on("request", expressApp)
            .listen(config.port, () => {
                logger.info(`Server listening on port ${config.port}`);
            });
    } catch (err) {
        logger.error(err, "Error boostrapping server");
        process.exit(1);
    }
})();
