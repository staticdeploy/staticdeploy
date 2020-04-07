import { UserNotFoundError } from "../common/errors";
import Usecase from "../common/Usecase";
import { Operation } from "../entities/OperationLog";

export default class DeleteUser extends Usecase {
    async exec(id: string): Promise<void> {
        // Auth check
        await this.authorizer.ensureCanDeleteUser();

        const toBeDeletedUser = await this.storages.users.findOne(id);

        // Ensure the user exists
        if (!toBeDeletedUser) {
            throw new UserNotFoundError(id);
        }

        // Delete the user
        await this.storages.users.deleteOne(id);

        // Log the operation
        await this.operationLogger.logOperation(Operation.DeleteUser, {
            deletedUser: toBeDeletedUser,
        });
    }
}
