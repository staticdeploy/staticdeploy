import {
    IOperationLog,
    IOperationLogsStorage,
    Operation,
} from "@staticdeploy/core";
import { Knex } from "knex";

import convertErrors from "./common/convertErrors";
import tables from "./common/tables";

@convertErrors
export default class OperationLogsStorage implements IOperationLogsStorage {
    constructor(private knex: Knex) {}

    async findMany(): Promise<IOperationLog[]> {
        const operationLogs = await this.knex(tables.operationLogs);
        return operationLogs;
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
        const [createdOperationLog] = await this.knex(tables.operationLogs)
            .insert(toBeCreatedOperationLog)
            .returning("*");
        return createdOperationLog;
    }
}
