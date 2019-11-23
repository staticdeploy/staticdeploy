import express from "express";
import sinon from "sinon";

import {
    IBaseRequest,
    managementApiAdapter,
    staticServerAdapter
} from "../src";

interface IExecMocks {
    [usecase: string]: sinon.SinonStub;
}

export function getManagementApiAdapter(
    execMocks: IExecMocks
): express.Express {
    return getServer(
        execMocks,
        managementApiAdapter({
            serviceName: "serviceName",
            serviceVersion: "serviceVersion",
            serviceHost: "serviceHost",
            serviceBasePath: "/"
        }),
        "/"
    );
}

export function getStaticServerAdapterServer(
    execMocks: IExecMocks,
    options?: { mountPath?: string; hostnameHeader?: string }
): express.Express {
    return getServer(
        execMocks,
        staticServerAdapter(options || {}),
        options && options.mountPath
    );
}

function getServer(
    execMocks: IExecMocks,
    app: express.Application,
    mountPath = "/"
) {
    return express()
        .use((req: IBaseRequest, _res, next) => {
            req.makeUsecase = (name: string) =>
                ({ exec: execMocks[name] } as any);
            next();
        })
        .use(mountPath, app);
}
