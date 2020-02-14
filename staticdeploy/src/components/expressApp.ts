import {
    IAuthenticationStrategy,
    IExternalCacheService,
    IStoragesModule
} from "@staticdeploy/core";
import {
    IUsecasesByName,
    staticServerAdapter
} from "@staticdeploy/http-adapters";
import tarArchiver from "@staticdeploy/tar-archiver";
import express from "express";
import vhost from "vhost";

import IConfig from "../common/IConfig";
import extractAuthToken from "../middleware/extractAuthToken";
import injectLogger from "../middleware/injectLogger";
import injectMakeUsecase from "../middleware/injectMakeUsecase";

export default function getExpressApp(options: {
    authenticationStrategies: IAuthenticationStrategy[];
    externalCacheServices: IExternalCacheService[];
    config: IConfig;
    managementRouter: express.Router;
    storagesModule: IStoragesModule;
    usecases: IUsecasesByName;
}): express.Application {
    const {
        authenticationStrategies,
        externalCacheServices,
        config,
        managementRouter,
        storagesModule,
        usecases
    } = options;

    return express()
        .disable("x-powered-by")
        .use([
            injectLogger(),
            extractAuthToken(),
            injectMakeUsecase(usecases, {
                archiver: tarArchiver,
                authenticationStrategies: authenticationStrategies,
                externalCacheServices: externalCacheServices,
                config: { enforceAuth: config.enforceAuth },
                storages: storagesModule.getStorages()
            }),
            vhost(config.managementHostname, managementRouter),
            staticServerAdapter({ hostnameHeader: config.hostnameHeader })
        ]);
}
