import Usecase from "../common/Usecase";
import { IOperationLog } from "../entities/OperationLog";

export default class GetOperationLogs extends Usecase {
    async exec(): Promise<IOperationLog[]> {
        // Auth check
        await this.authorizer.ensureCanGetOperationLogs();

        return this.storages.operationLogs.findMany();
    }
}
