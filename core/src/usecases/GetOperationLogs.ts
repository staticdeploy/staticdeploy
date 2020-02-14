import Usecase from "../common/Usecase";
import { IOperationLog } from "../entities/OperationLog";

type Arguments = [];
type ReturnValue = IOperationLog[];

export default class GetOperationLogs extends Usecase<Arguments, ReturnValue> {
    protected async _exec(): Promise<ReturnValue> {
        // Auth check
        this.authorizer.ensureCanGetOperationLogs();

        return this.storages.operationLogs.findMany();
    }
}
