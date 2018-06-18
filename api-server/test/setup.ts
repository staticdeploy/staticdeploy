import chai from "chai";
import chaiFuzzy from "chai-fuzzy";
import { createTree, destroyTree, IDefinition } from "create-fs-tree";
import { mkdirpSync, readFileSync, removeSync } from "fs-extra";
import { Server } from "http";
import { tmpdir } from "os";
import { join } from "path";
import S3rver from "s3rver";
import tar from "tar";
import { v4 } from "uuid";

import storage from "services/storage";

// Setup chai plugins
chai.use(chaiFuzzy);

// Base test directory
const tempTestDirPath = join(tmpdir(), "/staticdeploy/api-server");
mkdirpSync(tempTestDirPath);

// Start the S3 mock
const s3rver = new S3rver({
    directory: join(tempTestDirPath, "/s3"),
    silent: true
});
let s3rverServer: Server;
// Ensure s3rver is running before running tests
before(done => {
    s3rverServer = s3rver.run(done);
});
// Close s3rver after tests, so that we don't get EADDRINUSE errors when testing
// locally with --watch
after(done => {
    s3rverServer.close(done);
});

// Makes a targz buffer from a create-fs-tree filesystem definition
export function targzOf(definition: IDefinition): Buffer {
    const targzId = v4();
    const contentPath = join(tempTestDirPath, targzId);
    const contentTargzPath = join(tempTestDirPath, `${targzId}.tar.gz`);
    createTree(contentPath, definition);
    tar.create({ cwd: contentPath, file: contentTargzPath, sync: true }, ["."]);
    destroyTree(contentPath);
    const contentTargz = readFileSync(contentTargzPath);
    removeSync(contentTargzPath);
    return contentTargz;
}

// Function to insert fixtures into staticdeploy's storage
export interface IData {
    apps?: { name: string }[];
    entrypoints?: {
        appId: string | number;
        bundleId?: string | number;
        urlMatcher: string;
    }[];
    bundles?: { name: string; tag: string }[];
    operationLogs?: {}[];
}
export interface IIds {
    apps: string[];
    entrypoints: string[];
    bundles: string[];
    operationLogs: string[];
}
export async function insertFixtures(data: IData): Promise<IIds> {
    // Setup and reset staticdeploy's storage
    await storage.setup();
    // Deleting all apps results in all entrypoints being deleted as well
    const apps = await storage.apps.findAll();
    for (const app of apps) {
        await storage.apps.delete(app.id);
    }
    const bundles = await storage.bundles.findAll();
    for (const bundle of bundles) {
        await storage.bundles.delete(bundle.id);
    }
    const operationLogs = await storage.operationLogs.findAll();
    for (const operationLog of operationLogs) {
        await storage.operationLogs.delete(operationLog.id);
    }

    const ids: IIds = {
        apps: [],
        entrypoints: [],
        bundles: [],
        operationLogs: []
    };

    // Insert provided storage fixtures
    for (const bundle of data.bundles || []) {
        const { id } = await storage.bundles.create({
            ...bundle,
            description: "description",
            content: targzOf({ file: "file" }),
            fallbackAssetPath: "/file"
        });
        ids.bundles.push(id);
    }
    for (const app of data.apps || []) {
        const { id } = await storage.apps.create(app);
        ids.apps.push(id);
    }
    for (const entrypoint of data.entrypoints || []) {
        const { appId, bundleId } = entrypoint;
        const { id } = await storage.entrypoints.create({
            ...entrypoint,
            appId: typeof appId === "number" ? ids.apps[appId] : appId,
            bundleId:
                typeof bundleId === "number" ? ids.bundles[bundleId] : bundleId
        });
        ids.entrypoints.push(id);
    }
    for (const operationLog of data.operationLogs || []) {
        const { id } = await storage.operationLogs.create({
            operation: "operation",
            parameters: {},
            performedBy: "performedBy",
            ...operationLog
        });
        ids.operationLogs.push(id);
    }

    return ids;
}
