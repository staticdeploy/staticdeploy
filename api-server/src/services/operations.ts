import { IOperationLog } from "@staticdeploy/common-types";

import IBaseRequest from "common/IBaseRequest";
import storage from "services/storage";

export enum Operation {
    // Apps
    createApp = "apps:create",
    updateApp = "apps:update",
    deleteApp = "apps:delete",

    // Entrypoints
    createEntrypoint = "entrypoints:create",
    updateEntrypoint = "entrypoints:update",
    deleteEntrypoint = "entrypoints:delete",

    // Bundles
    createBundle = "bundles:create",
    deleteBundle = "bundles:delete"
}

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
