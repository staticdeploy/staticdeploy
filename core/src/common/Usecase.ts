import IRequestContext from "../dependencies/IRequestContext";
import IStorages from "../dependencies/IStorages";
import Authorizer from "../services/Authorizer";
import OperationLogger from "../services/OperationLogger";

export default abstract class Usecase {
    protected storages: IStorages;
    protected requestContext: IRequestContext;
    protected operationLogger: OperationLogger;
    protected authorizer: Authorizer;

    constructor(dependencies: {
        storages: IStorages;
        requestContext: IRequestContext;
    }) {
        this.storages = dependencies.storages;
        this.requestContext = dependencies.requestContext;
        this.operationLogger = new OperationLogger(
            this.storages.operationLogs,
            this.requestContext
        );
        this.authorizer = new Authorizer(this.requestContext);
    }

    abstract exec(...args: any[]): any;
}
