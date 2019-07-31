import { RequestHandler } from "express";
import jwt from "express-jwt";

import IAuthenticatedRequest from "../common/IAuthenticatedRequest";

interface IJwtAuthenticatedRequest extends IAuthenticatedRequest {
    jwt: any;
}

export default function authenticateRequest(jwtSecret: Buffer): RequestHandler {
    const jwtMiddleware = jwt({
        secret: jwtSecret,
        credentialsRequired: false,
        requestProperty: "jwt"
    });
    return (req: IJwtAuthenticatedRequest, res, next) => {
        jwtMiddleware(req, res, err => {
            if (err) {
                res.status(401).send({ message: err.message });
            } else if (req.jwt && !req.jwt.sub) {
                res.status(401).send({
                    message: "jwt must specify a subject (sub)"
                });
            } else {
                req.user = req.jwt
                    ? {
                          id: req.jwt.sub,
                          roles: Array.isArray(req.jwt.roles)
                              ? req.jwt.roles
                              : []
                      }
                    : null;
                delete req.jwt;
                next();
            }
        });
    };
}
