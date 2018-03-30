import { IModels } from "./models";
import IOperationLog from "./types/IOperationLog";
import generateId from "./utils/generateId";
import toPojo from "./utils/toPojo";

export default class OperationLogsClient {
    private OperationLog: IModels["OperationLog"];

    constructor(options: { models: IModels }) {
        this.OperationLog = options.models.OperationLog;
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
}
