import { IOperationLog, Operation } from "@staticdeploy/common-types";

import IBaseRequest from "common/IBaseRequest";
import storage from "services/storage";

export async function logOperation(
    req: IBaseRequest,
    operation: Operation,
    parameters: IOperationLog["parameters"]
) {
    try {
        await storage.operationLogs.create({
            operation: operation,
            parameters: parameters,
            performedBy: req.user.sub
        });
    } catch (err) {
        req.log.error(
            err,
            `Failed to save OperationLog for operation ${operation}`
        );
    }
}
