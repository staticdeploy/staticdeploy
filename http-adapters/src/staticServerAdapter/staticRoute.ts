import { RequestHandler } from "express";

import IBaseRequest from "../IBaseRequest";

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
                path: req.path
            });

            res.status(response.statusCode)
                .set(response.headers)
                .send(response.body);
        } catch (err) {
            next(err);
        }
    };
}
