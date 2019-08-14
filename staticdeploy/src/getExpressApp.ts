import { IAuthenticationStrategy, IStoragesModule } from "@staticdeploy/core";
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
import { dirname } from "path";
import vhost from "vhost";

import IConfig from "./common/IConfig";
import removeUndefs from "./common/removeUndefs";
import createRootUserAndGroup from "./init/createRootUserAndGroup";
import setupAuthenticationStrategies from "./init/setupAuthenticationStrategies";
import setupStorages from "./init/setupStorages";
import extractAuthToken from "./middleware/extractAuthToken";
import injectMakeUsecase from "./middleware/injectMakeUsecase";

export default async function getExpressApp(options: {
    config: IConfig;
    authenticationStrategies: IAuthenticationStrategy[];
    storagesModule: IStoragesModule;
    usecases: IUsecasesByName;
    logger: Logger;
}): Promise<express.Express> {
    const {
        config,
        authenticationStrategies,
        logger,
        storagesModule,
        usecases
    } = options;

    // Run init functions
    await setupAuthenticationStrategies(authenticationStrategies);
    await setupStorages(storagesModule);
    if (config.createRootUser) {
        await createRootUserAndGroup(
            storagesModule.getStorages(),
            config.managementHostname
        );
    }

    const managementConsoleStaticServer = await serveStatic({
        root: dirname(require.resolve("@staticdeploy/management-console")),
        fallbackAssetPath: "/index.html",
        fallbackStatusCode: 200,
        configuration: removeUndefs({
            API_URL: `//${config.managementHostname}/api`,
            AUTH_ENFORCEMENT_LEVEL: config.authEnforcementLevel.toString(),
            OIDC_ENABLED: (
                !!config.oidcConfigurationUrl && !!config.oidcClientId
            ).toString(),
            OIDC_CONFIGURATION_URL: config.oidcConfigurationUrl,
            OIDC_CLIENT_ID: config.oidcClientId,
            OIDC_REDIRECT_URL: `https://${config.managementHostname}`,
            OIDC_PROVIDER_NAME: config.oidcProviderName,
            JWT_ENABLED: (!!config.jwtSecretOrPublicKey).toString()
        }),
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

    return express().use([
        bunyanMiddleware({
            logger: logger,
            obscureHeaders: ["Authorization"]
        }),
        extractAuthToken(),
        injectMakeUsecase(usecases, {
            archiver: tarArchiver,
            authenticationStrategies: authenticationStrategies,
            config: { authEnforcementLevel: config.authEnforcementLevel },
            storages: storagesModule.getStorages()
        }),
        vhost(config.managementHostname, managementRouter),
        staticServerAdapter({ hostnameHeader: config.hostnameHeader })
    ]);
}
