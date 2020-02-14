import { UserNotFoundError } from "../common/functionalErrors";
import Usecase from "../common/Usecase";
import { Operation } from "../entities/OperationLog";

type Arguments = [string];
type ReturnValue = void;

export default class DeleteUser extends Usecase<Arguments, ReturnValue> {
    protected async _exec(id: Arguments[0]): Promise<ReturnValue> {
        // Auth check
        this.authorizer.ensureCanDeleteUser();

        const toBeDeletedUser = await this.storages.users.findOne(id);

        // Ensure the user exists
        if (!toBeDeletedUser) {
            throw new UserNotFoundError(id);
        }

        // Delete the user
        await this.storages.users.deleteOne(id);

        // Log the operation
        await this.operationLogger.logOperation(Operation.DeleteUser, {
            deletedUser: toBeDeletedUser
        });
    }
}
