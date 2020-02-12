import IArchiver from "../dependencies/IArchiver";
import IAuthenticationStrategy from "../dependencies/IAuthenticationStrategy";
import IExternalCacheService from "../dependencies/IExternalCacheService";
import ILogger from "../dependencies/ILogger";
import IRequestContext from "../dependencies/IRequestContext";
import IStorages from "../dependencies/IStorages";
import IUsecaseConfig from "../dependencies/IUsecaseConfig";
import { IUserWithRoles } from "../entities/User";
import Authenticator from "../services/Authenticator";
import Authorizer from "../services/Authorizer";
import Logger from "../services/Logger";
import OperationLogger from "../services/OperationLogger";
import { FunctionalError } from "./functionalErrors";
import UnexpectedError from "./UnexpectedError";

export default abstract class Usecase<Arguments extends any[], ReturnValue> {
    // Services
    protected authorizer: Authorizer;
    protected authenticator: Authenticator;
    protected log: Logger;
    protected operationLogger: OperationLogger;
    // Dependencies
    protected archiver: IArchiver;
    private authenticationStrategies: IAuthenticationStrategy[];
    private config: IUsecaseConfig;
    protected externalCacheServices: IExternalCacheService[];
    private logger: ILogger;
    private requestContext: IRequestContext;
    protected storages: IStorages;
    // State
    protected user: IUserWithRoles | null;

    constructor(options: {
        archiver: IArchiver;
        authenticationStrategies: IAuthenticationStrategy[];
        externalCacheServices: IExternalCacheService[];
        config: IUsecaseConfig;
        requestContext: IRequestContext;
        storages: IStorages;
        logger: ILogger;
    }) {
        // Dependencies
        this.archiver = options.archiver;
        this.authenticationStrategies = options.authenticationStrategies;
        this.config = options.config;
        this.externalCacheServices = options.externalCacheServices;
        this.logger = options.logger;
        this.requestContext = options.requestContext;
        this.storages = options.storages;

        // Services
        this.log = new Logger(
            this.logger,
            this.requestContext,
            this.constructor.name
        );
        this.authenticator = new Authenticator(
            this.storages.users,
            this.authenticationStrategies,
            this.config.enforceAuth,
            this.requestContext.authToken
        );
        this.authorizer = new Authorizer(this.config.enforceAuth);
        this.operationLogger = new OperationLogger(this.storages.operationLogs);

        // State
        this.user = null;
    }

    async exec(...args: Arguments): Promise<ReturnValue> {
        const startedAt = Date.now();
        this.log.info("usecase execution started");

        try {
            this.user = await this.authenticator.getUser();
            this.log._setUser(this.user);
            this.authorizer._setUser(this.user);
            this.operationLogger._setUser(this.user);

            const result = await this._exec(...args);

            this.log.info("usecase execution terminated successfully", {
                execTime: Date.now() - startedAt
            });

            return result;
        } catch (err) {
            if (err instanceof FunctionalError) {
                this.log.info("usecase execution terminated with error", {
                    execTime: Date.now() - startedAt,
                    error: {
                        name: err.constructor.name,
                        message: err.message
                    }
                });

                throw err;
            } else {
                this.log.error("usecase execution failed unexpectedly", {
                    execTime: Date.now() - startedAt,
                    error: err
                });

                throw new UnexpectedError();
            }
        }
    }

    protected abstract _exec(...args: Arguments): Promise<ReturnValue>;

    protected makeUsecase<U extends Usecase<any, any>>(UsecaseClass: {
        new (dependencies: {
            archiver: IArchiver;
            authenticationStrategies: IAuthenticationStrategy[];
            config: IUsecaseConfig;
            externalCacheServices: IExternalCacheService[];
            logger: ILogger;
            requestContext: IRequestContext;
            storages: IStorages;
        }): U;
    }): U {
        return new UsecaseClass({
            archiver: this.archiver,
            authenticationStrategies: this.authenticationStrategies,
            config: this.config,
            externalCacheServices: this.externalCacheServices,
            logger: this.logger,
            requestContext: this.requestContext,
            storages: this.storages
        });
    }
}
