import { IStoragesModule } from "@staticdeploy/core";

export default async function setupStorages(
    storagesModule: IStoragesModule
): Promise<void> {
    await storagesModule.setup();
}
