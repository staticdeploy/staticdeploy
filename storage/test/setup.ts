import chai = require("chai");
import chaiAsPromised = require("chai-as-promised");
import { emptyDir, mkdirp, remove, removeSync } from "fs-extra";
import os = require("os");
import path = require("path");
import Sequelize = require("sequelize");

import StorageClient from "../src";
import migrate from "../src/migrate";
import getModels, { IModels } from "../src/models";

chai.use(chaiAsPromised);

const databasePath = path.join(os.tmpdir(), "db.sqlite");
const databaseUrl = `sqlite://${databasePath}`;
export const deploymentsPath = path.join(os.tmpdir(), "deployments");

removeSync(databasePath);

export const storageClient = new StorageClient({
    databaseUrl,
    deploymentsPath
});

const sequelize = new Sequelize(databaseUrl, { logging: false });
export const models: IModels = getModels(sequelize);

export interface IData {
    apps?: { id: string; name: string }[];
    entrypoints?: { id: string; urlMatcher: string; appId: string }[];
    deployments?: { id: string; entrypointId: string }[];
}

export async function insertFixtures(data: IData) {
    const { App, Deployment, Entrypoint } = models;

    // Setup and/or reset database
    await migrate(sequelize);
    await emptyDir(deploymentsPath);
    await Deployment.destroy({ where: {} });
    await Entrypoint.destroy({ where: {} });
    await App.destroy({ where: {} });

    // Setup and/or reset filesystem
    await remove(deploymentsPath);
    await mkdirp(deploymentsPath);

    // Insert provided database fixtures
    for (const app of data.apps || []) {
        await App.create({
            ...app,
            defaultConfiguration: {}
        });
    }
    for (const entrypoint of data.entrypoints || []) {
        await Entrypoint.create({
            ...entrypoint,
            fallbackResource: "index.html",
            activeDeploymentId: null,
            configuration: null
        });
    }
    for (const deployment of data.deployments || []) {
        await Deployment.create({
            ...deployment,
            description: null
        });
        await mkdirp(path.join(deploymentsPath, deployment.id));
    }
}
