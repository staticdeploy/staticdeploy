import { IOperationLog, Operation } from "../entities/OperationLog";

export default interface IOperationLogsStorage {
    findMany(): Promise<IOperationLog[]>;
    createOne(operationLog: {
        id: string;
        operation: Operation;
        parameters: {
            [key: string]: any;
        };
        performedBy: string;
        performedAt: Date;
    }): Promise<IOperationLog>;
}
