import StorageClient from "@staticdeploy/storage";

import * as config from "config";

export default new StorageClient({
    databaseUrl: config.DATABASE_URL,
    s3Config: {
        bucket: config.S3_BUCKET,
        endpoint: config.S3_ENDPOINT,
        accessKeyId: config.S3_ACCESS_KEY_ID,
        secretAccessKey: config.S3_SECRET_ACCESS_KEY
    }
});
