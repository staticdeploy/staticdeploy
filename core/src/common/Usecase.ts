import IArchiver from "../dependencies/IArchiver";
import IAuthenticationStrategy from "../dependencies/IAuthenticationStrategy";
import IRequestContext from "../dependencies/IRequestContext";
import IStorages from "../dependencies/IStorages";
import IUsecaseConfig from "../dependencies/IUsecaseConfig";
import Authenticator from "../services/Authenticator";
import Authorizer from "../services/Authorizer";
import OperationLogger from "../services/OperationLogger";

export default abstract class Usecase {
    // Services
    protected authorizer: Authorizer;
    protected operationLogger: OperationLogger;
    // Dependencies
    protected archiver: IArchiver;
    protected storages: IStorages;
    private config: IUsecaseConfig;
    private requestContext: IRequestContext;
    private authenticationStrategies: IAuthenticationStrategy[];

    constructor(options: {
        archiver: IArchiver;
        authenticationStrategies: IAuthenticationStrategy[];
        config: IUsecaseConfig;
        requestContext: IRequestContext;
        storages: IStorages;
    }) {
        // Dependencies
        this.authenticationStrategies = options.authenticationStrategies;
        this.archiver = options.archiver;
        this.config = options.config;
        this.requestContext = options.requestContext;
        this.storages = options.storages;

        // Services
        const authenticator = new Authenticator(
            options.authenticationStrategies,
            this.requestContext.authToken
        );
        this.authorizer = new Authorizer(
            this.storages.users,
            authenticator,
            this.config.enforceAuth
        );
        this.operationLogger = new OperationLogger(
            this.storages.operationLogs,
            this.authorizer
        );
    }

    abstract exec(...args: any[]): any;

    protected makeUsecase<U extends Usecase>(UsecaseClass: {
        new (dependencies: {
            archiver: IArchiver;
            authenticationStrategies: IAuthenticationStrategy[];
            config: IUsecaseConfig;
            requestContext: IRequestContext;
            storages: IStorages;
        }): U;
    }): U {
        return new UsecaseClass({
            archiver: this.archiver,
            authenticationStrategies: this.authenticationStrategies,
            config: this.config,
            requestContext: this.requestContext,
            storages: this.storages
        });
    }
}
