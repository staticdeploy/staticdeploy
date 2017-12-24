import StorageClient from "@staticdeploy/storage";

import { DATABASE_URL, DEPLOYMENTS_PATH } from "config";

export default new StorageClient({
    databaseUrl: DATABASE_URL,
    deploymentsPath: DEPLOYMENTS_PATH
});
