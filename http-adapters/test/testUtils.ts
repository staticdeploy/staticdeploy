import express from "express";
import sinon from "sinon";

import { apiAdapter, IBaseRequest, staticServerAdapter } from "../src";

interface IExecMocks {
    [usecase: string]: sinon.SinonStub;
}

export function getApiAdapterServer(execMocks: IExecMocks): express.Express {
    return getServer(
        execMocks,
        apiAdapter({
            serviceName: "serviceName",
            serviceVersion: "serviceVersion",
            serviceHost: "serviceHost"
        })
    );
}

export function getStaticServerAdapterServer(
    execMocks: IExecMocks,
    options?: { hostnameHeader?: string }
): express.Express {
    return getServer(execMocks, staticServerAdapter(options || {}));
}

function getServer(execMocks: IExecMocks, app: express.Express) {
    return express()
        .use((req: IBaseRequest, _res, next) => {
            req.makeUsecase = (name: string) =>
                ({ exec: execMocks[name] } as any);
            next();
        })
        .use(app);
}
