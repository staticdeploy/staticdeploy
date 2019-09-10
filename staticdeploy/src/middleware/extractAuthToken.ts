import { RequestHandler } from "express";
import { isString } from "lodash";

import IRequestWithAuthToken from "../common/IRequestWithAuthToken";

export default function extractAuthToken(): RequestHandler {
    return (req: IRequestWithAuthToken, _res, next) => {
        req.authToken = null;

        // Support bearer auth tokens in authorization header
        const authorizationHeader = req.headers.authorization;
        if (
            isString(authorizationHeader) &&
            /^Bearer /i.test(authorizationHeader)
        ) {
            req.authToken = authorizationHeader.slice("Bearer ".length);
        }

        next();
    };
}
