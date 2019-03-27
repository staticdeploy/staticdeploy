import IAppsStorage from "../dependencies/IAppsStorage";
import IBundlesStorage from "../dependencies/IBundlesStorage";
import IEntrypointsStorage from "../dependencies/IEntrypointsStorage";
import IOperationLogsStorage from "../dependencies/IOperationLogsStorage";
import IRequestContext from "../dependencies/IRequestContext";
import Authorizer from "../services/Authorizer";
import OperationLogger from "../services/OperationLogger";

export default abstract class Usecase {
    protected appsStorage: IAppsStorage;
    protected bundlesStorage: IBundlesStorage;
    protected entrypointsStorage: IEntrypointsStorage;
    protected operationLogsStorage: IOperationLogsStorage;
    protected requestContext: IRequestContext;
    protected operationLogger: OperationLogger;
    protected authorizer: Authorizer;

    constructor(dependencies: {
        appsStorage: IAppsStorage;
        bundlesStorage: IBundlesStorage;
        entrypointsStorage: IEntrypointsStorage;
        operationLogsStorage: IOperationLogsStorage;
        requestContext: IRequestContext;
    }) {
        this.appsStorage = dependencies.appsStorage;
        this.bundlesStorage = dependencies.bundlesStorage;
        this.entrypointsStorage = dependencies.entrypointsStorage;
        this.operationLogsStorage = dependencies.operationLogsStorage;
        this.requestContext = dependencies.requestContext;
        this.operationLogger = new OperationLogger(
            this.operationLogsStorage,
            this.requestContext
        );
        this.authorizer = new Authorizer(this.requestContext);
    }

    abstract exec(...args: any[]): any;
}
