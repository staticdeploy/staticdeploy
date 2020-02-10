import IArchiver from "../dependencies/IArchiver";
import IAuthenticationStrategy from "../dependencies/IAuthenticationStrategy";
import IExternalCacheService from "../dependencies/IExternalCacheService";
import IRequestContext from "../dependencies/IRequestContext";
import IStorages from "../dependencies/IStorages";
import IUsecaseConfig from "../dependencies/IUsecaseConfig";
import Authenticator from "../services/Authenticator";
import Authorizer from "../services/Authorizer";
import ExternalCacheService from "../services/ExternalCacheService";
import OperationLogger from "../services/OperationLogger";

export default abstract class Usecase {
    // Services
    protected authorizer: Authorizer;
    protected operationLogger: OperationLogger;
    protected externalCacheService: ExternalCacheService;
    // Dependencies
    protected archiver: IArchiver;
    private authenticationStrategies: IAuthenticationStrategy[];
    private externalCacheServices: IExternalCacheService[];
    private config: IUsecaseConfig;
    private requestContext: IRequestContext;
    protected storages: IStorages;

    constructor(options: {
        archiver: IArchiver;
        authenticationStrategies: IAuthenticationStrategy[];
        externalCacheServices: IExternalCacheService[];
        config: IUsecaseConfig;
        requestContext: IRequestContext;
        storages: IStorages;
    }) {
        // Dependencies
        this.archiver = options.archiver;
        this.authenticationStrategies = options.authenticationStrategies;
        this.externalCacheServices = options.externalCacheServices;
        this.config = options.config;
        this.requestContext = options.requestContext;
        this.storages = options.storages;

        // Services
        const authenticator = new Authenticator(
            this.authenticationStrategies,
            this.requestContext.authToken
        );
        this.authorizer = new Authorizer(
            this.storages.users,
            authenticator,
            this.config.enforceAuth
        );
        this.externalCacheService = new ExternalCacheService(
            options.externalCacheServices
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
            externalCacheServices: IExternalCacheService[];
            config: IUsecaseConfig;
            requestContext: IRequestContext;
            storages: IStorages;
        }): U;
    }): U {
        return new UsecaseClass({
            archiver: this.archiver,
            authenticationStrategies: this.authenticationStrategies,
            externalCacheServices: this.externalCacheServices,
            config: this.config,
            requestContext: this.requestContext,
            storages: this.storages
        });
    }
}
