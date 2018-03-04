import StorageClient from "@staticdeploy/storage";

import { STORAGE_DATABASE_URL, STORAGE_DEPLOYMENTS_PATH } from "config";

export default new StorageClient({
    databaseUrl: STORAGE_DATABASE_URL,
    deploymentsPath: STORAGE_DEPLOYMENTS_PATH
});
