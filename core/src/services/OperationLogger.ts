import generateId from "../common/generateId";
import IOperationLogsStorage from "../dependencies/IOperationLogsStorage";
import { IOperationLog, Operation } from "../entities/OperationLog";
import { IUser } from "../entities/User";

export default class OperationLogger {
    private user: IUser | null = null;
    constructor(private operationLogs: IOperationLogsStorage) {}

    _setUser(user: IUser | null): void {
        this.user = user;
    }

    async logOperation(
        operation: Operation,
        parameters: IOperationLog["parameters"]
    ): Promise<void> {
        await this.operationLogs.createOne({
            id: generateId(),
            operation: operation,
            parameters: parameters,
            performedBy: this.user?.id ?? "anonymous",
            performedAt: new Date()
        });
    }
}
