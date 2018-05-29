import { S3 } from "aws-sdk";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { createTree, destroyTree, IDefinition } from "create-fs-tree";
import { mkdirpSync, readFileSync, removeSync } from "fs-extra";
import { Server } from "http";
import { tmpdir } from "os";
import { join } from "path";
import S3rver from "s3rver";
import tar from "tar";
import { v4 } from "uuid";

import StorageClient from "../src";
import { IModels } from "../src/models";

chai.use(chaiAsPromised);

// Base test directory
const tempTestDirPath = join(tmpdir(), "/staticdeploy/storage");
mkdirpSync(tempTestDirPath);

// If a database url is provided, use that. Otherwise, set up a local sqlite
// database and test against that
let databaseUrl;
if (process.env.TEST_DATABASE_URL) {
    databaseUrl = process.env.TEST_DATABASE_URL;
} else {
    const databasePath = join(tempTestDirPath, "db.sqlite");
    databaseUrl = `sqlite://${databasePath}`;
}

// If an S3 config is provided, use that. Otherwise, set up a local S3 mock and
// test against that
let s3Config;
if (process.env.TEST_S3_BUCKET) {
    s3Config = {
        bucket: process.env.TEST_S3_BUCKET,
        endpoint: process.env.TEST_S3_ENDPOINT!,
        accessKeyId: process.env.TEST_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.TEST_S3_SECRET_ACCESS_KEY!
    };
} else {
    const s3rver = new S3rver({
        directory: join(tempTestDirPath, "/s3"),
        silent: true
    });
    let s3rverServer: Server;
    // Ensure s3rver is running before running tests
    before(done => {
        s3rverServer = s3rver.run(done);
    });
    // Close s3rver after tests, so that we don't get EADDRINUSE errors when
    // testing locally with --watch
    after(done => {
        s3rverServer.close(done);
    });
    s3Config = {
        bucket: "staticdeploy",
        endpoint: "http://localhost:4578",
        accessKeyId: "accessKeyId",
        secretAccessKey: "secretAccessKey"
    };
}

// Setup storage client. Export it as it's used in tests to perform operations
export const storageClient = new StorageClient({ databaseUrl, s3Config });

// Export storage client's db models, S3 client, and S3 bucket name. They will
// be used in tests for verifying the state of the database and of S3
export const models: IModels = (storageClient as any).models;
export const s3Client: S3 = (storageClient as any).s3Client;
export const s3Bucket: string = (storageClient as any).s3Bucket;

// Function to insert fixtures into the database and S3
export interface IData {
    apps?: { id: string; name: string }[];
    bundles?: {
        id: string;
        name: string;
        tag: string;
        createdAt?: Date;
    }[];
    entrypoints?: {
        id: string;
        urlMatcher: string;
        appId: string;
        bundleId?: string;
    }[];
    operationLogs?: { id: string }[];
}
export async function insertFixtures(data: IData) {
    const { App, Bundle, Entrypoint, OperationLog } = models;

    // Setup storage client (safe to run on each fixtures insertion, as it's an
    // idempotent function)
    await storageClient.setup();

    // Empty the database
    await Entrypoint.destroy({ where: {} });
    await App.destroy({ where: {} });
    await Bundle.destroy({ where: {} });
    await OperationLog.destroy({ where: {} });

    // Empty the S3 bucket
    const objects = await s3Client.listObjects({ Bucket: s3Bucket }).promise();
    await s3Client
        .deleteObjects({
            Bucket: s3Bucket,
            Delete: {
                Objects: objects.Contents!.map(obj => ({ Key: obj.Key! }))
            }
        })
        .promise();

    // Insert provided database fixtures
    for (const bundle of data.bundles || []) {
        await Bundle.create({
            id: bundle.id,
            name: bundle.name,
            tag: bundle.tag,
            createdAt: bundle.createdAt,
            description: "description",
            hash: "hash",
            assets: [{ path: "/file", mimeType: "application/octet-stream" }]
        });
        // Add a dummy file on S3
        await s3Client
            .putObject({
                Bucket: s3Bucket,
                Key: `${bundle.id}/file`,
                Body: "file"
            })
            .promise();
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
            redirectTo: null,
            configuration: null,
            ...entrypoint
        });
    }
    for (const operationLog of data.operationLogs || []) {
        await OperationLog.create({
            operation: "operation",
            parameters: {},
            performedBy: "performedBy",
            ...operationLog
        });
    }
}

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
