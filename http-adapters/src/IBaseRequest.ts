import { ILogger } from "@staticdeploy/core";
import { Request } from "express";

import IUsecasesByName from "./IUsecasesByName";

export default interface IBaseRequest extends Request {
    log: ILogger;
    makeUsecase: <Name extends keyof IUsecasesByName>(
        name: Name
    ) => InstanceType<IUsecasesByName[Name]>;
}
