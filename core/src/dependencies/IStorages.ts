import { IHealthCheckResult } from "../entities/HealthCheckResult";
import IAppsStorage from "./IAppsStorage";
import IBundlesStorage from "./IBundlesStorage";
import IEntrypointsStorage from "./IEntrypointsStorage";
import IGroupsStorage from "./IGroupsStorage";
import IOperationLogsStorage from "./IOperationLogsStorage";
import IUsersStorage from "./IUsersStorage";

export default interface IStorages {
    apps: IAppsStorage;
    bundles: IBundlesStorage;
    entrypoints: IEntrypointsStorage;
    groups: IGroupsStorage;
    operationLogs: IOperationLogsStorage;
    users: IUsersStorage;
    checkHealth: () => Promise<IHealthCheckResult>;
}
