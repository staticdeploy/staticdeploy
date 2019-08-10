import { CreateRootUserAndGroup, IStorages } from "@staticdeploy/core";

export default async function createRootUserAndGroup(
    storages: IStorages,
    idp: string
): Promise<void> {
    await new CreateRootUserAndGroup(storages).exec(idp);
}
