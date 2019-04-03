import { IStorages } from "@staticdeploy/core";

import registerAppsStorageTests from "./AppsStorage";
import registerBundlesStorageTests from "./BundlesStorage";
import registerEntrypointsStorageTests from "./EntrypointsStorage";
import registerOperationLogsStorageTests from "./OperationLogsStorage";

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
        registerAppsStorageTests(options.storages);
        registerBundlesStorageTests(options.storages);
        registerEntrypointsStorageTests(options.storages);
        registerOperationLogsStorageTests(options.storages);
    });
}
