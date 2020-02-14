import { ILogger } from "@staticdeploy/core";
import { RequestHandler } from "express";

import IRequestWithLogger from "../common/IRequestWithLogger";

export default function injectLogger(getLogger: () => ILogger): RequestHandler {
    return (req: IRequestWithLogger, _res, next) => {
        req.logger = getLogger();
        next();
    };
}
