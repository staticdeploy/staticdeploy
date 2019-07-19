import { Request } from "express";

import IUsecasesByName from "./IUsecasesByName";

export default interface IBaseRequest extends Request {
    makeUsecase: <Name extends keyof IUsecasesByName>(
        name: Name
    ) => InstanceType<IUsecasesByName[Name]>;
}
