import StorageClient from "@staticdeploy/storage";

import { STORAGE_BUNDLES_PATH, STORAGE_DATABASE_URL } from "config";

export default new StorageClient({
    databaseUrl: STORAGE_DATABASE_URL,
    bundlesPath: STORAGE_BUNDLES_PATH
});
