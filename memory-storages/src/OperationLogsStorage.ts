import {
    IOperationLog,
    IOperationLogsStorage,
    Operation
} from "@staticdeploy/core";
import { toArray } from "lodash";

import cloneMethodsIO from "./common/cloneMethodsIO";
import convertErrors from "./common/convertErrors";

@cloneMethodsIO
@convertErrors
export default class OperationLogsStorage implements IOperationLogsStorage {
    private operationLogs: { [id: string]: IOperationLog } = {};

    async findMany(): Promise<IOperationLog[]> {
        return toArray(this.operationLogs);
    }

    async createOne(toBeCreatedOperationLog: {
        id: string;
        operation: Operation;
        parameters: {
            [key: string]: any;
        };
        performedBy: string;
        performedAt: Date;
    }): Promise<IOperationLog> {
        this.operationLogs[
            toBeCreatedOperationLog.id
        ] = toBeCreatedOperationLog;
        return toBeCreatedOperationLog;
    }
}
