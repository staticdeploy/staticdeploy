import { IHealthCheckResult } from "../entities/HealthCheckResult";
import IAppsStorage from "./IAppsStorage";
import IBundlesStorage from "./IBundlesStorage";
import IEntrypointsStorage from "./IEntrypointsStorage";
import IOperationLogsStorage from "./IOperationLogsStorage";

export default interface IStorages {
    apps: IAppsStorage;
    bundles: IBundlesStorage;
    entrypoints: IEntrypointsStorage;
    operationLogs: IOperationLogsStorage;
    checkHealth: () => Promise<IHealthCheckResult>;
}
