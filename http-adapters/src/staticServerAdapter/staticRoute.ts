import { RequestHandler } from "express";

import IBaseRequest from "../IBaseRequest";
import getPathFromOriginalUrl from "./getPathFromOriginalUrl";

export default function staticRoute(options: {
    hostnameHeader?: string;
}): RequestHandler {
    return async (req: IBaseRequest, res, next) => {
        try {
            const hostnameHeader =
                options.hostnameHeader && options.hostnameHeader.toLowerCase();
            const hostname =
                hostnameHeader &&
                typeof req.headers[hostnameHeader] === "string"
                    ? (req.headers[hostnameHeader] as string)
                    : req.hostname;

            const respondToEndpointRequest = req.makeUsecase(
                "respondToEndpointRequest"
            );
            const response = await respondToEndpointRequest.exec({
                hostname: hostname,
                // In order to be able to redirect to the correct canonical
                // path, the usecase needs the original path the user is
                // requesting (req.path is not the original path in case
                // staticServerAdapter has a mount path different than / (root))
                path: getPathFromOriginalUrl(req.originalUrl)
            });

            res.status(response.statusCode)
                .set(response.headers)
                .send(response.body);
        } catch (error) {
            req.log.error("unhandled request error", {
                error: error
            });
            next(error);
        }
    };
}
