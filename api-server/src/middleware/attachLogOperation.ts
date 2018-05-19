import { IOperationLog } from "@staticdeploy/common-types";
import { RequestHandler } from "express";

import IBaseRequest from "common/IBaseRequest";
import { logOperation, Operation } from "services/operations";

export default function attachLogOperation(): RequestHandler {
    return (req: IBaseRequest, _res, next) => {
        req.logOperation = (
            operation: Operation,
            parameters: IOperationLog["parameters"]
        ) => logOperation(req, operation, parameters);
        next();
    };
}
