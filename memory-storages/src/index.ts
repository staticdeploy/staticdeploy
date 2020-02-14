import {
    IApp,
    IBundle,
    IEntrypoint,
    IExternalCache,
    IGroup,
    IHealthCheckResult,
    IOperationLog,
    IStorages,
    IStoragesModule,
    IUser
} from "@staticdeploy/core";

import AppsStorage from "./AppsStorage";
import BundlesStorage from "./BundlesStorage";
import { ICollection } from "./common/ICollection";
import EntrypointsStorage from "./EntrypointsStorage";
import ExternalCachesStorage from "./ExternalCachesStorage";
import GroupsStorage from "./GroupsStorage";
import OperationLogsStorage from "./OperationLogsStorage";
import UsersStorage from "./UsersStorage";

interface IDb {
    apps: ICollection<IApp>;
    bundles: ICollection<IBundle>;
    entrypoints: ICollection<IEntrypoint>;
    externalCaches: ICollection<IExternalCache>;
    groups: ICollection<IGroup>;
    operationLogs: ICollection<IOperationLog>;
    users: ICollection<IUser & { groupsIds: string[] }>;
}

export default class MemoryStorages implements IStoragesModule {
    private db: IDb = {
        apps: {},
        bundles: {},
        groups: {},
        entrypoints: {},
        externalCaches: {},
        operationLogs: {},
        users: {}
    };

    async setup(): Promise<void> {
        // Noop
    }

    getStorages(): IStorages {
        return {
            apps: new AppsStorage(this.db.apps),
            bundles: new BundlesStorage(this.db.bundles),
            entrypoints: new EntrypointsStorage(this.db.entrypoints),
            externalCaches: new ExternalCachesStorage(this.db.externalCaches),
            groups: new GroupsStorage(this.db.groups),
            operationLogs: new OperationLogsStorage(this.db.operationLogs),
            users: new UsersStorage(this.db.users, this.db.groups),
            checkHealth: this.checkHealth.bind(this)
        };
    }

    private async checkHealth(): Promise<IHealthCheckResult> {
        return { isHealthy: true };
    }
}
