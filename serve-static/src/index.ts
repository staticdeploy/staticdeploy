import { AuthEnforcementLevel, IConfiguration } from "@staticdeploy/core";
import { IBaseRequest, staticServerAdapter } from "@staticdeploy/http-adapters";
import MemoryStorages from "@staticdeploy/memory-storages";
import tarArchiver from "@staticdeploy/tar-archiver";
import { Router } from "express";

import getMakeUsecase from "./getMakeUsecase";
import usecases from "./usecases";

const SERVE_STATIC_LOCALHOST = "serve-static.localhost";
const HOST_HEADER = "x-serve-static-host-header";

export default async function serveStatic(options: {
    root: string;
    configuration: IConfiguration;
    fallbackAssetPath: string;
    fallbackStatusCode: number;
    headers: {
        [assetMatcher: string]: {
            [headerName: string]: string;
        };
    };
}): Promise<Router> {
    const storagesModule = new MemoryStorages();
    await storagesModule.setup();

    const makeUsecase = getMakeUsecase(usecases, {
        archiver: tarArchiver,
        authenticationStrategies: [],
        config: { authEnforcementLevel: AuthEnforcementLevel.None },
        requestContext: { authToken: null },
        storages: storagesModule.getStorages()
    });

    const createBundle = makeUsecase("createBundle");
    const bundle = await createBundle.exec({
        name: "default",
        tag: "default",
        description: "default",
        content: await tarArchiver.makeArchiveFromPath(options.root),
        fallbackAssetPath: options.fallbackAssetPath,
        fallbackStatusCode: options.fallbackStatusCode,
        headers: options.headers
    });
    const createApp = makeUsecase("createApp");
    const app = await createApp.exec({ name: "default" });
    const createEntrypoint = makeUsecase("createEntrypoint");
    createEntrypoint.exec({
        appId: app.id,
        urlMatcher: `${SERVE_STATIC_LOCALHOST}/`,
        bundleId: bundle.id,
        configuration: options.configuration
    });

    return Router()
        .use((req: IBaseRequest, _res, next) => {
            // Inject makeUsecase, needed by the staticServerAdapter
            req.makeUsecase = makeUsecase;
            // Inject the header staticServerAdapter uses for routing
            req.headers[HOST_HEADER] = SERVE_STATIC_LOCALHOST;
            next();
        })
        .use(staticServerAdapter({ hostnameHeader: HOST_HEADER }));
}
