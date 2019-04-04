import { IHealthCheckResult, IStorages } from "@staticdeploy/core";

import AppsStorage from "./AppsStorage";
import BundlesStorage from "./BundlesStorage";
import EntrypointsStorage from "./EntrypointsStorage";
import OperationLogsStorage from "./OperationLogsStorage";

export default class MemoryStorages {
    getStorages(): IStorages {
        return {
            apps: new AppsStorage(),
            bundles: new BundlesStorage(),
            entrypoints: new EntrypointsStorage(),
            operationLogs: new OperationLogsStorage(),
            checkHealth: this.checkHealth.bind(this)
        };
    }

    async checkHealth(): Promise<IHealthCheckResult> {
        return { isHealthy: true };
    }
}
