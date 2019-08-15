import { CreateRootUserAndGroup, IStorages } from "@staticdeploy/core";
import IConfig from "../common/IConfig";

export default async function createRootUserAndGroup(
    config: IConfig,
    storages: IStorages
): Promise<void> {
    if (config.createRootUser) {
        await new CreateRootUserAndGroup(storages).exec(
            config.managementHostname
        );
    }
}
