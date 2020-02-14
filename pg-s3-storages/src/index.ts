import {
    IHealthCheckResult,
    ILogger,
    IStorages,
    IStoragesModule
} from "@staticdeploy/core";
import { S3 } from "aws-sdk";
import Knex from "knex";
import { extname, join } from "path";

import AppsStorage from "./AppsStorage";
import BundlesStorage from "./BundlesStorage";
import EntrypointsStorage from "./EntrypointsStorage";
import ExternalCachesStorage from "./ExternalCachesStorage";
import GroupsStorage from "./GroupsStorage";
import OperationLogsStorage from "./OperationLogsStorage";
import UsersStorage from "./UsersStorage";

export default class PgS3Storages implements IStoragesModule {
    private knex: Knex;
    private s3Client: S3;
    private s3Bucket: string;
    private log: ILogger;

    constructor(options: {
        postgresUrl: string;
        s3Config: {
            bucket: string;
            endpoint: string;
            accessKeyId: string;
            secretAccessKey: string;
        };
        logger: ILogger;
    }) {
        this.log = options.logger;

        // Instantiate knex
        this.knex = Knex(options.postgresUrl);

        // Instantiate S3 client
        this.s3Bucket = options.s3Config.bucket;
        this.s3Client = new S3({
            endpoint: options.s3Config.endpoint,
            accessKeyId: options.s3Config.accessKeyId,
            secretAccessKey: options.s3Config.secretAccessKey,
            s3ForcePathStyle: true
        });
    }

    async setup() {
        await this.runSqlMigrations();
        await this.createS3Bucket();
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
            externalCaches: new ExternalCachesStorage(this.knex),
            groups: new GroupsStorage(this.knex),
            operationLogs: new OperationLogsStorage(this.knex),
            users: new UsersStorage(this.knex),
            checkHealth: this.checkHealth.bind(this)
        };
    }

    private async checkHealth(): Promise<IHealthCheckResult> {
        const healthCheckResult: IHealthCheckResult = {
            isHealthy: true,
            details: {}
        };

        try {
            await this.knex.raw("select 1");
        } catch (error) {
            healthCheckResult.isHealthy = false;
            healthCheckResult.details.postgres = {
                message: "Unable to run query 'select 1'",
                error: error
            };
        }

        try {
            await this.s3Client.headBucket({ Bucket: this.s3Bucket }).promise();
        } catch (error) {
            healthCheckResult.isHealthy = false;
            healthCheckResult.isHealthy = false;
            healthCheckResult.details.s3 = {
                message: `Unable to HEAD bucket ${this.s3Bucket}`,
                error: error
            };
        }

        return healthCheckResult;
    }

    private async runSqlMigrations() {
        const isCurrentFileTs = extname(__filename) === ".ts";
        try {
            await this.knex.migrate.latest({
                directory: join(__dirname, "./migrations"),
                loadExtensions: [isCurrentFileTs ? ".ts" : ".js"]
            } as any);
        } catch (error) {
            this.log.error("PgS3Storages: error running sql migration", {
                error
            });
            throw error;
        }
    }

    private async createS3Bucket() {
        // Check if the bucket exists and we can be accessed with our keys
        try {
            await this.s3Client.headBucket({ Bucket: this.s3Bucket }).promise();
            return;
        } catch (error) {
            if (error.statusCode !== 404) {
                this.log.error(
                    `PgS3Storages: error accessing bucket = ${this.s3Bucket}`,
                    { error }
                );
                throw error;
            }
        }

        // If the bucket doesn't exist, create it
        try {
            await this.s3Client
                .createBucket({ Bucket: this.s3Bucket })
                .promise();
        } catch (error) {
            this.log.error(
                `PgS3Storages: error creating bucket = ${this.s3Bucket}`,
                { error }
            );
            throw error;
        }
    }
}
