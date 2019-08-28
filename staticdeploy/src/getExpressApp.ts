import { IStoragesModule } from "@staticdeploy/core";
import {
    IUsecasesByName,
    managementApiAdapter,
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
}): Promise<express.Application> {
    const { config, logger, storagesModule, usecases } = options;

    await storagesModule.setup();

    const managementConsoleStaticServer = await serveStatic({
        root: dirname(require.resolve("@staticdeploy/management-console")),
        fallbackAssetPath: "/index.html",
        fallbackStatusCode: 200,
        configuration: {
            API_URL: `//${config.managementHostname}/api`
        },
        headers: {}
    });

    const managementRouter = express
        .Router()
        .use(
            "/api",
            managementApiAdapter({
                serviceName: config.appName,
                serviceVersion: config.appVersion,
                serviceHost: config.managementHostname
            })
        )
        .use(managementConsoleStaticServer);

    return express()
        .disable("x-powered-by")
        .use(
            bunyanMiddleware({
                logger: logger,
                obscureHeaders: ["Authorization"]
            })
        )
        .use(authenticateRequest(config.jwtSecret))
        .use(injectMakeUsecase({ storagesModule, usecases }))
        .use(vhost(config.managementHostname, managementRouter))
        .use(staticServerAdapter({ hostnameHeader: config.hostnameHeader }));
}
