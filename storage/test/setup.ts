import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { emptyDir, mkdirp, mkdirpSync, remove, removeSync } from "fs-extra";
import os from "os";
import path from "path";
import Sequelize from "sequelize";

import StorageClient from "../src";
import migrate from "../src/migrate";
import getModels, { IModels } from "../src/models";

chai.use(chaiAsPromised);

export const baseTestsPath = path.join(
    os.tmpdir(),
    "staticdeploy-storage-tests"
);
mkdirpSync(baseTestsPath);

const databasePath = path.join(baseTestsPath, "db.sqlite");
// Ideally, we would remove and re-create the database file on each fixture
// insertion. However, doing so casues sequelize to lose the database connection
// and to throw SequelizeDatabaseError-s. It would be too bothersome to also
// re-create the Sequelize instance (and the StorageClient) on each fixture
// insertion, so we just remove the database file once here at the beginning of
// the test run, and we delete all objects in it on each fixture insertion. That
// is still enough to ensure us a clean database on each test run.
removeSync(databasePath);
const databaseUrl = `sqlite://${databasePath}`;

export const bundlesPath = path.join(baseTestsPath, "bundles");

export const storageClient = new StorageClient({
    databaseUrl,
    bundlesPath
});

const sequelize = new Sequelize(databaseUrl, {
    logging: false,
    operatorsAliases: false
});
export const models: IModels = getModels(sequelize);

export interface IData {
    apps?: { id: string; name: string }[];
    entrypoints?: {
        id: string;
        urlMatcher: string;
        appId: string;
        bundleId?: string;
    }[];
    bundles?: { id: string; name: string; tag: string; createdAt?: Date }[];
}

export async function insertFixtures(data: IData) {
    const { App, Bundle, Entrypoint } = models;

    // Setup and/or reset database
    await migrate(sequelize);
    await emptyDir(bundlesPath);
    await Entrypoint.destroy({ where: {} });
    await App.destroy({ where: {} });
    await Bundle.destroy({ where: {} });

    // Setup and/or reset filesystem
    await remove(bundlesPath);
    await mkdirp(bundlesPath);

    // Insert provided database fixtures
    for (const bundle of data.bundles || []) {
        await Bundle.create({
            ...bundle,
            description: "description",
            hash: "hash",
            assets: []
        });
        await mkdirp(path.join(bundlesPath, bundle.id));
    }
    for (const app of data.apps || []) {
        await App.create({
            ...app,
            defaultConfiguration: {}
        });
    }
    for (const entrypoint of data.entrypoints || []) {
        await Entrypoint.create({
            bundleId: null,
            configuration: null,
            ...entrypoint
        });
    }
}
