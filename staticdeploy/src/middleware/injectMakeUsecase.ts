import { IStoragesModule } from "@staticdeploy/core";
import { IUsecasesByName } from "@staticdeploy/http-adapters";
import tarArchiver from "@staticdeploy/tar-archiver";
import { RequestHandler } from "express";

import IAuthenticatedRequest from "../common/IAuthenticatedRequest";

export default (options: {
    storagesModule: IStoragesModule;
    usecases: IUsecasesByName;
}): RequestHandler => (req: IAuthenticatedRequest, _res, next) => {
    const { usecases, storagesModule } = options;
    req.makeUsecase = <Name extends keyof IUsecasesByName>(name: Name) => {
        const UsecaseClass = usecases[name];
        return new UsecaseClass({
            storages: storagesModule.getStorages(),
            requestContext: {
                userId: req.user ? req.user.id : null
            },
            archiver: tarArchiver
        }) as InstanceType<IUsecasesByName[Name]>;
    };
    next();
};
