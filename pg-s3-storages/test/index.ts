import registerStoragesTests from "@staticdeploy/storages-test-suite";
import { S3 } from "aws-sdk";
import Knex from "knex";

import PgS3Storages from "../src";
import tables from "../src/common/tables";

execStorageTest({ googleCloudStorageCompatible: false });
execStorageTest({ googleCloudStorageCompatible: true });

function execStorageTest({
    googleCloudStorageCompatible,
}: {
    googleCloudStorageCompatible: boolean;
}) {
    // Create a pgS3Storages object with test configurations
    const pgS3Storages = new PgS3Storages({
        postgresUrl: "postgres://postgres:password@localhost/postgres",
        s3Config: {
            bucket: "test",
            endpoint: "http://localhost:9000",
            accessKeyId: "accessKeyId",
            secretAccessKey: "secretAccessKey",
            googleCloudStorageCompatible,
        },
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
            await knex(tables.entrypoints).delete();
            await knex(tables.apps).delete();
            await knex(tables.bundles).delete();
            await knex(tables.operationLogs).delete();
            await knex(tables.usersAndGroups).delete();
            await knex(tables.groups).delete();
            await knex(tables.users).delete();

            // Empty the S3 bucket
            const objects = await s3Client
                .listObjects({ Bucket: s3Bucket })
                .promise();
            if (objects.Contents && objects.Contents.length > 0) {
                await s3Client
                    .deleteObjects({
                        Bucket: s3Bucket,
                        Delete: {
                            Objects: objects.Contents.map((obj) => ({
                                Key: obj.Key!,
                            })),
                        },
                    })
                    .promise();
            }
        },
    });
}
