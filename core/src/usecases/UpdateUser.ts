import { SomeGroupNotFoundError, UserNotFoundError } from "../common/errors";
import Usecase from "../common/Usecase";
import { Operation } from "../entities/OperationLog";
import { IUser } from "../entities/User";

export default class UpdateUser extends Usecase {
    async exec(
        id: string,
        patch: {
            name?: string;
            groupsIds?: string[];
        }
    ): Promise<IUser> {
        // Auth check
        await this.authorizer.ensureCanUpdateUser();

        const existingUser = await this.storages.users.findOne(id);

        // Ensure the user exists
        if (!existingUser) {
            throw new UserNotFoundError(id);
        }

        // Ensure all the linked groups exist
        if (
            patch.groupsIds &&
            !(await this.storages.groups.allExistWithIds(patch.groupsIds))
        ) {
            throw new SomeGroupNotFoundError(patch.groupsIds);
        }

        // Update the user
        const updatedUser = await this.storages.users.updateOne(id, {
            name: patch.name,
            groupsIds: patch.groupsIds,
            updatedAt: new Date(),
        });

        // Log the operation
        await this.operationLogger.logOperation(Operation.UpdateUser, {
            oldUser: existingUser,
            newUser: updatedUser,
        });

        return updatedUser;
    }
}
