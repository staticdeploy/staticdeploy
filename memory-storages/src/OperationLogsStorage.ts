import {
    IOperationLog,
    IOperationLogsStorage,
    Operation,
} from "@staticdeploy/core";
import { toArray } from "lodash";

import cloneMethodsIO from "./common/cloneMethodsIO";
import convertErrors from "./common/convertErrors";
import { ICollection } from "./common/ICollection";

@cloneMethodsIO
@convertErrors
export default class OperationLogsStorage implements IOperationLogsStorage {
    constructor(private operationLogs: ICollection<IOperationLog>) {}

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
        this.operationLogs[toBeCreatedOperationLog.id] =
            toBeCreatedOperationLog;
        return toBeCreatedOperationLog;
    }
}
