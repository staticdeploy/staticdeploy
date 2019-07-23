import { IConvRoute } from "convexpress";
import { Response } from "express";

import IBaseRequest from "../IBaseRequest";
import handleUsecaseErrors from "./handleUsecaseErrors";

interface IConvRouteWithBaseRequest extends IConvRoute {
    handler: (req: IBaseRequest, res: Response) => any;
}
export default (convroute: IConvRouteWithBaseRequest): IConvRoute => ({
    ...convroute,
    handler: handleUsecaseErrors(convroute.handler)
});
