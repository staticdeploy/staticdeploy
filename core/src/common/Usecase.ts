import IArchiver from "../dependencies/IArchiver";
import IRequestContext from "../dependencies/IRequestContext";
import IStorages from "../dependencies/IStorages";
import IUsecaseConfig from "../dependencies/IUsecaseConfig";
import Authorizer from "../services/Authorizer";
import OperationLogger from "../services/OperationLogger";

export default abstract class Usecase {
    protected archiver: IArchiver;
    protected config: IUsecaseConfig;
    protected requestContext: IRequestContext;
    protected storages: IStorages;
    protected authorizer: Authorizer;
    protected operationLogger: OperationLogger;

    constructor(options: {
        archiver: IArchiver;
        config: IUsecaseConfig;
        requestContext: IRequestContext;
        storages: IStorages;
    }) {
        this.archiver = options.archiver;
        this.config = options.config;
        this.requestContext = options.requestContext;
        this.storages = options.storages;
        this.authorizer = new Authorizer(
            this.requestContext.user,
            this.config.enforceAuth
        );
        this.operationLogger = new OperationLogger(
            this.storages.operationLogs,
            this.requestContext
        );
    }

    abstract exec(...args: any[]): any;

    protected makeUsecase<U extends Usecase>(UsecaseClass: {
        new (dependencies: {
            archiver: IArchiver;
            config: IUsecaseConfig;
            requestContext: IRequestContext;
            storages: IStorages;
        }): U;
    }): U {
        return new UsecaseClass({
            archiver: this.archiver,
            config: this.config,
            requestContext: this.requestContext,
            storages: this.storages
        });
    }
}
