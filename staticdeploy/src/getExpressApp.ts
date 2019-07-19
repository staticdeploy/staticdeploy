import { IStoragesModule } from "@staticdeploy/core";
import {
    apiAdapter,
    IUsecasesByName,
    staticServerAdapter
} from "@staticdeploy/http-adapters";
import serveStatic from "@staticdeploy/serve-static";
import Logger from "bunyan";
import bunyanMiddleware from "bunyan-middleware";
import express from "express";
import { dirname } from "path";
import vhost from "vhost";

import IConfig from "./common/IConfig";
import authenticateRequest from "./middleware/authenticateRequest";
import injectMakeUsecase from "./middleware/injectMakeUsecase";

export default async function getExpressApp(options: {
    config: IConfig;
    storagesModule: IStoragesModule;
    usecases: IUsecasesByName;
    logger: Logger;
}): Promise<express.Express> {
    const { config, logger, storagesModule, usecases } = options;

    await storagesModule.setup();

    const adminConsoleStaticServer = await serveStatic({
        root: dirname(require.resolve("@staticdeploy/admin-console")),
        fallbackAssetPath: "/index.html",
        fallbackStatusCode: 200,
        configuration: {
            API_URL: `//${config.adminHostname}/api`
        },
        headers: {}
    });

    const adminRouter = express
        .Router()
        .use(
            "/api",
            apiAdapter({
                serviceName: config.appName,
                serviceVersion: config.appVersion,
                serviceHost: config.adminHostname
            })
        )
        .use(adminConsoleStaticServer);

    return express()
        .use(
            bunyanMiddleware({
                logger: logger,
                obscureHeaders: ["Authorization"]
            })
        )
        .use(authenticateRequest(config.jwtSecret))
        .use(injectMakeUsecase({ storagesModule, usecases }))
        .use(vhost(config.adminHostname, adminRouter))
        .use(staticServerAdapter({ hostnameHeader: config.hostnameHeader }));
}
