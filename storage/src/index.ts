import { mkdirp } from "fs-extra";
import Sequelize from "sequelize";

import AppsClient from "./AppsClient";
import DeploymentsClient from "./DeploymentsClient";
import EntrypointsClient from "./EntrypointsClient";
import migrate from "./migrate";
import getModels from "./models";
import IHealthCheckResult from "./types/IHealthCheckResult";

export { default as IApp } from "./types/IApp";
export { default as IAsset } from "./types/IAsset";
export { default as IConfiguration } from "./types/IConfiguration";
export { default as IDeployment } from "./types/IDeployment";
export { default as IEntrypoint } from "./types/IEntrypoint";

export * from "./utils/errors";

export default class StorageClient {
    apps: AppsClient;
    deployments: DeploymentsClient;
    entrypoints: EntrypointsClient;

    private deploymentsPath: string;
    private sequelize: Sequelize.Sequelize;

    constructor(options: { databaseUrl: string; deploymentsPath: string }) {
        this.deploymentsPath = options.deploymentsPath;

        // Instantiate sequelize
        this.sequelize = new Sequelize(options.databaseUrl, {
            logging: false,
            operatorsAliases: false
        });

        // Instantiate storage clients
        const models = getModels(this.sequelize);
        this.deployments = new DeploymentsClient({
            deploymentsPath: options.deploymentsPath,
            models: models
        });
        this.entrypoints = new EntrypointsClient({
            deploymentsClient: this.deployments,
            models: models
        });
        this.apps = new AppsClient({
            entrypointsClient: this.entrypoints,
            models: models
        });
    }

    async setup() {
        await migrate(this.sequelize);
        await mkdirp(this.deploymentsPath);
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
