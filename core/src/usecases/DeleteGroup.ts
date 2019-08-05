import { GroupHasUsersError, GroupNotFoundError } from "../common/errors";
import Usecase from "../common/Usecase";
import { Operation } from "../entities/OperationLog";

export default class DeleteUser extends Usecase {
    async exec(id: string): Promise<void> {
        // Auth check
        await this.authorizer.ensureCanDeleteGroup();

        const toBeDeletedGroup = await this.storages.groups.findOne(id);

        // Ensure the group exists
        if (!toBeDeletedGroup) {
            throw new GroupNotFoundError(id);
        }

        // Ensure the group has no linked users
        const hasLinkedUsers = await this.storages.users.anyExistsWithGroupId(
            id
        );
        if (hasLinkedUsers) {
            throw new GroupHasUsersError(id);
        }

        // Delete the group
        await this.storages.groups.deleteOne(id);

        // Log the operation
        await this.operationLogger.logOperation(Operation.DeleteGroup, {
            deletedGroup: toBeDeletedGroup
        });
    }
}
