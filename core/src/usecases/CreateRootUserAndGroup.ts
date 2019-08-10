import generateId from "../common/generateId";
import Usecase from "../common/Usecase";
import { RoleName } from "../entities/Role";
import { UserType } from "../entities/User";

export const ROOT_GROUP_NAME = "root";
export const ROOT_USER_IDP_ID = "root";
export const ROOT_USER_NAME = "root";

export default class CreateRootUserAndGroup extends Usecase {
    async exec(idp: string): Promise<void> {
        const now = new Date();

        // Create the root group if it doesn't exist
        let rootGroup = await this.storages.groups.findOneByName(
            ROOT_GROUP_NAME
        );
        if (!rootGroup) {
            rootGroup = await this.storages.groups.createOne({
                id: generateId(),
                name: ROOT_GROUP_NAME,
                roles: [RoleName.Root],
                createdAt: now,
                updatedAt: now
            });
        }

        // Create the root user if it doesn't exist
        const rootUserExists = await this.storages.users.oneExistsWithIdpAndIdpId(
            idp,
            ROOT_USER_IDP_ID
        );
        if (!rootUserExists) {
            await this.storages.users.createOne({
                id: generateId(),
                idp: idp,
                idpId: ROOT_USER_IDP_ID,
                type: UserType.Human,
                name: ROOT_USER_NAME,
                groupsIds: [rootGroup.id],
                createdAt: now,
                updatedAt: now
            });
        }
    }
}
