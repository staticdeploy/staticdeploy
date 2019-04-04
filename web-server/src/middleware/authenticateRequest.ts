import { Request, RequestHandler } from "express";
import jwt from "express-jwt";

interface IRequestWithUser extends Request {
    user: {
        sub?: string;
    };
}

export default function authenticateRequest(jwtSecret: Buffer): RequestHandler {
    const jwtMiddleware = jwt({
        secret: jwtSecret,
        credentialsRequired: true
    });
    return (req, res, next) => {
        jwtMiddleware(req, res, err => {
            if (err) {
                res.status(401).send({ message: err.message });
            } else if (!(req as IRequestWithUser).user.sub) {
                // On successful token verification, the middleware attaches the
                // user property to the request object. Hence the above type
                // casting
                res.status(401).send({
                    message: "JWT must specify a subject (sub)"
                });
            } else {
                next();
            }
        });
    };
}
