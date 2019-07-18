import {
    IApp,
    IBundle,
    IEntrypoint,
    IHealthCheckResult,
    IOperationLog,
    IStorages,
    IStoragesModule
} from "@staticdeploy/core";

import AppsStorage from "./AppsStorage";
import BundlesStorage from "./BundlesStorage";
import { ICollection } from "./common/ICollection";
import EntrypointsStorage from "./EntrypointsStorage";
import OperationLogsStorage from "./OperationLogsStorage";

interface IDb {
    apps: ICollection<IApp>;
    bundles: ICollection<IBundle>;
    entrypoints: ICollection<IEntrypoint>;
    operationLogs: ICollection<IOperationLog>;
}

export default class MemoryStorages implements IStoragesModule {
    private db: IDb = {
        apps: {},
        bundles: {},
        entrypoints: {},
        operationLogs: {}
    };

    async setup(): Promise<void> {
        // Noop
    }

    getStorages(): IStorages {
        return {
            apps: new AppsStorage(this.db.apps),
            bundles: new BundlesStorage(this.db.bundles),
            entrypoints: new EntrypointsStorage(this.db.entrypoints),
            operationLogs: new OperationLogsStorage(this.db.operationLogs),
            checkHealth: this.checkHealth.bind(this)
        };
    }

    private async checkHealth(): Promise<IHealthCheckResult> {
        return { isHealthy: true };
    }
}
