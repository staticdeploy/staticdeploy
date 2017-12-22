import { mkdirp } from "fs-extra";
import Sequelize = require("sequelize");

import AppsClient from "./AppsClient";
import DeploymentsClient from "./DeploymentsClient";
import EntrypointsClient from "./EntrypointsClient";
import migrate from "./migrate";
import getModels from "./models";

export default class StorageClient {
    apps: AppsClient;
    deployments: DeploymentsClient;
    entrypoints: EntrypointsClient;

    private deploymentsPath: string;
    private sequelize: Sequelize.Sequelize;

    constructor(options: { databaseUrl: string; deploymentsPath: string }) {
        // Instantiate sequelize
        const sequelize = new Sequelize(options.databaseUrl, {
            logging: false
        });
        const models = getModels(sequelize);

        // Instantiate storage clients
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
}
