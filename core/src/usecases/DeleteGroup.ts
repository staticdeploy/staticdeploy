import {
    GroupHasUsersError,
    GroupNotFoundError
} from "../common/functionalErrors";
import Usecase from "../common/Usecase";
import { Operation } from "../entities/OperationLog";

type Arguments = [string];
type ReturnValue = void;

export default class DeleteUser extends Usecase<Arguments, ReturnValue> {
    protected async _exec(id: Arguments[0]): Promise<ReturnValue> {
        // Auth check
        this.authorizer.ensureCanDeleteGroup();

        const toBeDeletedGroup = await this.storages.groups.findOne(id);

        // Ensure the group exists
        if (!toBeDeletedGroup) {
            throw new GroupNotFoundError(id);
        }

        // Ensure the group has no linked users
        const hasLinkedUsers = await this.storages.users.anyExistsWithGroup(id);
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
