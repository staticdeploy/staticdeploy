import {
    IArchiver,
    IAuthenticationStrategy,
    IStorages,
    IUsecaseConfig,
} from "@staticdeploy/core";
import { IUsecasesByName } from "@staticdeploy/http-adapters";
import { RequestHandler } from "express";

import IRequestWithAuthToken from "../common/IRequestWithAuthToken";

export default function injectMakeUsecase(
    usecases: IUsecasesByName,
    dependencies: {
        archiver: IArchiver;
        authenticationStrategies: IAuthenticationStrategy[];
        config: IUsecaseConfig;
        storages: IStorages;
    }
): RequestHandler {
    const {
        archiver,
        authenticationStrategies,
        config,
        storages,
    } = dependencies;
    return (req: IRequestWithAuthToken, _res, next) => {
        req.makeUsecase = <Name extends keyof IUsecasesByName>(name: Name) => {
            const UsecaseClass = usecases[name];
            return new UsecaseClass({
                archiver: archiver,
                authenticationStrategies: authenticationStrategies,
                config: config,
                requestContext: { authToken: req.authToken },
                storages: storages,
            }) as InstanceType<IUsecasesByName[Name]>;
        };
        next();
    };
}
