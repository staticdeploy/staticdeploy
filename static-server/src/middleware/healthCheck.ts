import { RequestHandler } from "express";
import { healthRoute } from "express-healthchecker";
import { IHealthRouteOptions } from "express-healthchecker/lib/typings";

interface IOptions extends IHealthRouteOptions {
    hostname?: string;
}

export default function healthCheck(options: IOptions): RequestHandler {
    const route = healthRoute(options);
    return (req, res, next) => {
        if (req.hostname === options.hostname && req.path === "/health") {
            route(req, res, next);
        } else {
            next();
        }
    };
}
