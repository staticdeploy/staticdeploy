import generateId from "../common/generateId";
import IOperationLogsStorage from "../dependencies/IOperationLogsStorage";
import IRequestContext from "../dependencies/IRequestContext";
import { IOperationLog, Operation } from "../entities/OperationLog";

export default class OperationLogger {
    constructor(
        private operationLogsStorage: IOperationLogsStorage,
        private requestContext: IRequestContext
    ) {}

    async logOperation(
        operation: Operation,
        parameters: IOperationLog["parameters"]
    ): Promise<void> {
        await this.operationLogsStorage.createOne({
            id: generateId(),
            operation: operation,
            parameters: parameters,
            // This service assumes the request to be authenticated
            performedBy: this.requestContext.userId!,
            createdAt: new Date()
        });
    }
}
