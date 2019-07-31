import { IArchiver, IStorages, IUsecaseConfig } from "@staticdeploy/core";
import { IUsecasesByName } from "@staticdeploy/http-adapters";
import { RequestHandler } from "express";

import IAuthenticatedRequest from "../common/IAuthenticatedRequest";

export default function injectMakeUsecase(
    usecases: IUsecasesByName,
    dependencies: {
        archiver: IArchiver;
        config: IUsecaseConfig;
        storages: IStorages;
    }
): RequestHandler {
    const { archiver, config, storages } = dependencies;
    return (req: IAuthenticatedRequest, _res, next) => {
        req.makeUsecase = <Name extends keyof IUsecasesByName>(name: Name) => {
            const UsecaseClass = usecases[name];
            return new UsecaseClass({
                archiver: archiver,
                config: config,
                requestContext: {
                    user: req.user ? req.user : null
                },
                storages: storages
            }) as InstanceType<IUsecasesByName[Name]>;
        };
        next();
    };
}
