import { IStorages } from "@staticdeploy/core";

import registerAppsStorageTests from "./AppsStorage";
import registerBundlesStorageTests from "./BundlesStorage";
import registerCheckHealthTests from "./checkHealth";
import registerEntrypointsStorageTests from "./EntrypointsStorage";
import registerExternalCachesStorageTests from "./ExternalCachesStorage";
import registerGroupsStorageTests from "./GroupsStorage";
import registerOperationLogsStorageTests from "./OperationLogsStorage";
import registerUsersStorageTests from "./UsersStorage";

interface IOptions {
    storagesName: string;
    setupStorages: () => Promise<void>;
    eraseStorages: () => Promise<void>;
    storages: IStorages;
}
export default function registerStoragesTests(options: IOptions): void {
    before(async () => {
        await options.setupStorages();
    });
    beforeEach(async () => {
        await options.eraseStorages();
    });
    describe(`storages test suite for ${options.storagesName}`, () => {
        registerCheckHealthTests(options.storages);
        registerAppsStorageTests(options.storages);
        registerBundlesStorageTests(options.storages);
        registerEntrypointsStorageTests(options.storages);
        registerExternalCachesStorageTests(options.storages);
        registerGroupsStorageTests(options.storages);
        registerOperationLogsStorageTests(options.storages);
        registerUsersStorageTests(options.storages);
    });
}
