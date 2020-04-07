import registerStoragesTests from "@staticdeploy/storages-test-suite";

import MemoryStorages from "../src";
import { ICollection } from "../src/common/ICollection";

const memoryStorages = new MemoryStorages();
const storages = memoryStorages.getStorages();

registerStoragesTests({
    storagesName: "memory-storages",
    storages: storages,
    setupStorages: async () => undefined,
    eraseStorages: async () => {
        const eraseCollection = (collection: ICollection<any>) => {
            for (const id of Object.keys(collection)) {
                delete collection[id];
            }
        };
        eraseCollection((memoryStorages as any).db.apps);
        eraseCollection((memoryStorages as any).db.bundles);
        eraseCollection((memoryStorages as any).db.entrypoints);
        eraseCollection((memoryStorages as any).db.groups);
        eraseCollection((memoryStorages as any).db.operationLogs);
        eraseCollection((memoryStorages as any).db.users);
    },
});
