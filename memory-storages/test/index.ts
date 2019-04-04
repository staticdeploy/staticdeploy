import registerStoragesTests from "@staticdeploy/storages-test-suite";

import MemoryStorages from "../src";

const memoryStorages = new MemoryStorages();
const storages = memoryStorages.getStorages();

registerStoragesTests({
    storagesName: "pg-s3-storages",
    storages: storages,
    setupStorages: async () => undefined,
    eraseStorages: async () => {
        (storages.apps as any).apps = {};
        (storages.bundles as any).bundles = {};
        (storages.entrypoints as any).entrypoints = {};
        (storages.operationLogs as any).operationLogs = {};
    }
});
