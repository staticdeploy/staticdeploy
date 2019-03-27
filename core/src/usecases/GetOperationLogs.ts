import Usecase from "../common/Usecase";
import { IOperationLog } from "../entities/OperationLog";

export default class GetOperationLogs extends Usecase {
    async exec(): Promise<IOperationLog[]> {
        // Ensure the request is authenticated
        this.authorizer.ensureAuthenticated();

        return this.operationLogsStorage.findMany();
    }
}
