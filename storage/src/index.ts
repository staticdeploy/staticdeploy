import { S3 } from "aws-sdk";
import Sequelize from "sequelize";

import AppsClient from "./AppsClient";
import BundlesClient from "./BundlesClient";
import EntrypointsClient from "./EntrypointsClient";
import migrate from "./migrate";
import getModels, { IModels } from "./models";
import OperationLogsClient from "./OperationLogsClient";
import IHealthCheckResult from "./utils/IHealthCheckResult";

export { default as AppsClient } from "./AppsClient";
export { default as BundlesClient } from "./BundlesClient";
export { default as EntrypointsClient } from "./EntrypointsClient";

export * from "./utils/errors";
export * from "./utils/validators";

export default class StorageClient {
    apps: AppsClient;
    bundles: BundlesClient;
    entrypoints: EntrypointsClient;
    operationLogs: OperationLogsClient;

    private sequelize: Sequelize.Sequelize;
    private models: IModels;
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
        // Instantiate sequelize
        this.sequelize = new Sequelize(options.databaseUrl, {
            logging: false,
            operatorsAliases: false
        });
        this.models = getModels(this.sequelize);

        // Instantiate S3 client
        this.s3Bucket = options.s3Config.bucket;
        this.s3Client = new S3({
            endpoint: options.s3Config.endpoint,
            accessKeyId: options.s3Config.accessKeyId,
            secretAccessKey: options.s3Config.secretAccessKey,
            s3ForcePathStyle: true
        });

        // Instantiate storage clients
        this.apps = new AppsClient({ models: this.models });
        this.entrypoints = new EntrypointsClient({ models: this.models });
        this.bundles = new BundlesClient({
            models: this.models,
            s3Client: this.s3Client,
            s3Bucket: this.s3Bucket
        });
        this.operationLogs = new OperationLogsClient({ models: this.models });
    }

    async setup() {
        // Run database migrations
        await migrate(this.sequelize);

        // Create S3 bucket
        try {
            // Check if the bucket exists and we can be accessed with our keys
            await this.s3Client.headBucket({ Bucket: this.s3Bucket }).promise();
        } catch (err) {
            // If the bucket doesn't exist, create it
            await this.s3Client
                .createBucket({ Bucket: this.s3Bucket })
                .promise();
        }
    }

    async checkHealth(): Promise<IHealthCheckResult> {
        try {
            // Check if we can execute a query on the db
            await this.sequelize.query("select 1");

            // Check if we can access the S3 bucket
            await this.s3Client.headBucket({ Bucket: this.s3Bucket }).promise();

            return { isHealthy: true };
        } catch (err) {
            return { isHealthy: false, details: err };
        }
    }
}
