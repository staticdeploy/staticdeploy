import { IOperationLog } from "@staticdeploy/storage";

import IAuthenticatedRequest from "common/IAuthenticatedRequest";
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
    req: IAuthenticatedRequest,
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
