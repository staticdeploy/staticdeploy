import { IHealthCheckResult, IStorages } from "@staticdeploy/core";
import { S3 } from "aws-sdk";
import Knex from "knex";
import { join } from "path";

import AppsStorage from "./AppsStorage";
import BundlesStorage from "./BundlesStorage";
import { StorageSetupError } from "./common/errors";
import EntrypointsStorage from "./EntrypointsStorage";
import OperationLogsStorage from "./OperationLogsStorage";

export default class SqlS3Storages {
    private knex: Knex;
    private s3Client: S3;
    private s3Bucket: string;

    constructor(options: {
        databaseUrl: string;
        s3Config: {
            bucket: string;
            endpoint: string;
            accessKeyId: string;
            secretAccessKey: string;
        };
    }) {
        // Instantiate knex
        // TODO: remove as any once knex 0.16.4 is released
        this.knex = Knex(options.databaseUrl as any);

        // Instantiate S3 client
        this.s3Bucket = options.s3Config.bucket;
        this.s3Client = new S3({
            endpoint: options.s3Config.endpoint,
            accessKeyId: options.s3Config.accessKeyId,
            secretAccessKey: options.s3Config.secretAccessKey,
            s3ForcePathStyle: true
        });
    }

    getStorages(): IStorages {
        return {
            apps: new AppsStorage(this.knex),
            bundles: new BundlesStorage(
                this.knex,
                this.s3Client,
                this.s3Bucket
            ),
            entrypoints: new EntrypointsStorage(this.knex),
            operationLogs: new OperationLogsStorage(this.knex),
            checkHealth: this.checkHealth.bind(this)
        };
    }

    async checkHealth(): Promise<IHealthCheckResult> {
        try {
            await this.knex.raw("select 1");
            return { isHealthy: true };
        } catch {
            return { isHealthy: false };
        }
    }

    async setup() {
        await this.runSqlMigrations();
        await this.createS3Bucket();
    }

    private async runSqlMigrations() {
        try {
            await this.knex.migrate.latest({
                directory: join(__dirname, "./migrations"),
                loadExtensions: [".js", ".ts"]
            } as any);
        } catch (err) {
            throw new StorageSetupError("Error running sql migration", err);
        }
    }

    private async createS3Bucket() {
        // Check if the bucket exists and we can be accessed with our keys
        try {
            await this.s3Client.headBucket({ Bucket: this.s3Bucket }).promise();
            return;
        } catch (err) {
            if (err.statusCode !== 404) {
                throw new StorageSetupError(
                    `Error accessing bucket = ${this.s3Bucket}`,
                    err
                );
            }
        }

        // If the bucket doesn't exist, create it
        try {
            await this.s3Client
                .createBucket({ Bucket: this.s3Bucket })
                .promise();
        } catch (err) {
            throw new StorageSetupError(
                `Error creating bucket = ${this.s3Bucket}`,
                err
            );
        }
    }
}
