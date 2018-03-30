import { mkdirp } from "fs-extra";
import Sequelize from "sequelize";

import AppsClient from "./AppsClient";
import BundlesClient from "./BundlesClient";
import EntrypointsClient from "./EntrypointsClient";
import migrate from "./migrate";
import getModels from "./models";
import OperationLogsClient from "./OperationLogsClient";
import IHealthCheckResult from "./types/IHealthCheckResult";

export { default as IApp } from "./types/IApp";
export { default as IAsset } from "./types/IAsset";
export { default as IBundle } from "./types/IBundle";
export { default as IConfiguration } from "./types/IConfiguration";
export { default as IEntrypoint } from "./types/IEntrypoint";

export { default as AppsClient } from "./AppsClient";
export { default as BundlesClient } from "./BundlesClient";
export { default as EntrypointsClient } from "./EntrypointsClient";

export * from "./utils/errors";
export * from "./utils/validators";

export default class StorageClient {
    apps: AppsClient;
    bundles: BundlesClient;
    entrypoints: EntrypointsClient;
    operationLogs: OperationLogsClient;

    private bundlesPath: string;
    private sequelize: Sequelize.Sequelize;

    constructor(options: { databaseUrl: string; bundlesPath: string }) {
        this.bundlesPath = options.bundlesPath;

        // Instantiate sequelize
        this.sequelize = new Sequelize(options.databaseUrl, {
            logging: false,
            operatorsAliases: false
        });
        const models = getModels(this.sequelize);

        // Instantiate storage clients
        this.apps = new AppsClient({ models: models });
        this.entrypoints = new EntrypointsClient({ models: models });
        this.bundles = new BundlesClient({
            models: models,
            bundlesPath: this.bundlesPath
        });
        this.operationLogs = new OperationLogsClient({ models: models });
    }

    async setup() {
        await migrate(this.sequelize);
        await mkdirp(this.bundlesPath);
    }

    async checkHealth(): Promise<IHealthCheckResult> {
        try {
            await this.sequelize.query("select 1");
            return {
                isHealthy: true
            };
        } catch (err) {
            return {
                isHealthy: false,
                details: err
            };
        }
    }
}
