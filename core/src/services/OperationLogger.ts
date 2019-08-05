import generateId from "../common/generateId";
import IOperationLogsStorage from "../dependencies/IOperationLogsStorage";
import { IOperationLog, Operation } from "../entities/OperationLog";
import Authorizer from "./Authorizer";

export default class OperationLogger {
    constructor(
        private operationLogsStorage: IOperationLogsStorage,
        private authorizer: Authorizer
    ) {}

    async logOperation(
        operation: Operation,
        parameters: IOperationLog["parameters"]
    ): Promise<void> {
        const user = this.authorizer.getUser();
        await this.operationLogsStorage.createOne({
            id: generateId(),
            operation: operation,
            parameters: parameters,
            performedBy: user ? user.id : "anonymous",
            performedAt: new Date()
        });
    }
}
