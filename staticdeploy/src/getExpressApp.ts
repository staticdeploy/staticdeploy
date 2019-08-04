import { IStoragesModule } from "@staticdeploy/core";
import {
    IUsecasesByName,
    managementApiAdapter,
    staticServerAdapter
} from "@staticdeploy/http-adapters";
import serveStatic from "@staticdeploy/serve-static";
import tarArchiver from "@staticdeploy/tar-archiver";
import Logger from "bunyan";
import bunyanMiddleware from "bunyan-middleware";
import express from "express";
import { compact } from "lodash";
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

    const managementConsoleStaticServer = await serveStatic({
        root: dirname(require.resolve("@staticdeploy/management-console")),
        fallbackAssetPath: "/index.html",
        fallbackStatusCode: 200,
        configuration: {
            API_URL: `//${config.managementHostname}/api`,
            AUTH_ENFORCEMENT_LEVEL: config.authEnforcementLevel.toString()
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

    return express().use(
        compact([
            bunyanMiddleware({
                logger: logger,
                obscureHeaders: ["Authorization"]
            }),
            config.jwtSecret ? authenticateRequest(config.jwtSecret) : null,
            injectMakeUsecase(usecases, {
                archiver: tarArchiver,
                config: { authEnforcementLevel: config.authEnforcementLevel },
                storages: storagesModule.getStorages()
            }),
            vhost(config.managementHostname, managementRouter),
            staticServerAdapter({ hostnameHeader: config.hostnameHeader })
        ])
    );
}
