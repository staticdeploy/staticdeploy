import { IOperationLog } from "@staticdeploy/common-types";

import { IModels } from "./models";
import * as errors from "./utils/errors";
import generateId from "./utils/generateId";
import toPojo from "./utils/toPojo";

export default class OperationLogsClient {
    private OperationLog: IModels["OperationLog"];

    constructor(options: { models: IModels }) {
        this.OperationLog = options.models.OperationLog;
    }

    async findOneById(id: string): Promise<IOperationLog | null> {
        const operationLog = await this.OperationLog.findById(id);
        return toPojo(operationLog);
    }

    async findAll(): Promise<IOperationLog[]> {
        const operationLogs = await this.OperationLog.findAll();
        return operationLogs.map(toPojo);
    }

    async create(partial: {
        operation: string;
        parameters: { [key: string]: any };
        performedBy: string;
    }): Promise<IOperationLog> {
        // Create the operation log
        const operationLog = await this.OperationLog.create({
            id: generateId(),
            operation: partial.operation,
            parameters: partial.parameters,
            performedBy: partial.performedBy
        });

        return toPojo(operationLog);
    }

    async delete(id: string): Promise<void> {
        const operationLog = await this.OperationLog.findById(id);

        // Ensure the operation log exists
        if (!operationLog) {
            throw new errors.OperationLogNotFoundError(id);
        }

        // Delete the operation log
        await operationLog.destroy();
    }
}
