import registerStoragesTests from "@staticdeploy/storages-test-suite";
import { S3 } from "aws-sdk";
import Knex from "knex";

import PgS3Storages from "../src";
import { APPS_TABLE } from "../src/AppsStorage";
import { BUNDLES_TABLE } from "../src/BundlesStorage";
import { ENTRYPOINTS_TABLE } from "../src/EntrypointsStorage";
import { OPERATION_LOGS_TABLE } from "../src/OperationLogsStorage";

// Create a pgS3Storages object with test configurations
const pgS3Storages = new PgS3Storages({
    postgresUrl: "postgres://postgres@localhost/postgres",
    s3Config: {
        bucket: "test",
        endpoint: "http://localhost:9000",
        accessKeyId: "accessKeyId",
        secretAccessKey: "secretAccessKey"
    }
});

registerStoragesTests({
    storagesName: "pg-s3-storages",
    storages: pgS3Storages.getStorages(),
    setupStorages: () => pgS3Storages.setup(),
    eraseStorages: async () => {
        const knex: Knex = (pgS3Storages as any).knex;
        const s3Client: S3 = (pgS3Storages as any).s3Client;
        const s3Bucket: string = (pgS3Storages as any).s3Bucket;

        // Empty the database, starting from entrypoints since they reference apps
        // and bundles
        await knex(ENTRYPOINTS_TABLE).delete();
        await knex(APPS_TABLE).delete();
        await knex(BUNDLES_TABLE).delete();
        await knex(OPERATION_LOGS_TABLE).delete();

        // Empty the S3 bucket
        const objects = await s3Client
            .listObjects({ Bucket: s3Bucket })
            .promise();
        if (objects.Contents && objects.Contents.length > 0) {
            await s3Client
                .deleteObjects({
                    Bucket: s3Bucket,
                    Delete: {
                        Objects: objects.Contents.map(obj => ({
                            Key: obj.Key!
                        }))
                    }
                })
                .promise();
        }
    }
});
