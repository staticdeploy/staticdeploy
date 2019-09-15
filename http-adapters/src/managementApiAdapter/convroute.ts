import { IConvRoute } from "convexpress";
import { Response } from "express";

import IBaseRequest from "../IBaseRequest";
import handleUsecaseErrors from "./handleUsecaseErrors";

interface IConvRouteWithBaseRequest extends IConvRoute {
    handler: (req: IBaseRequest, res: Response) => any;
}
export default (convroute: IConvRouteWithBaseRequest): IConvRoute => ({
    ...convroute,
    responses: {
        ...convroute.responses,
        "400": { description: "Incorrect request params, validation failed" },
        "401": { description: "Authentication required" },
        "403": {
            description: "No user corresponding to idp user or missing roles"
        }
    },
    handler: handleUsecaseErrors(convroute.handler)
});
