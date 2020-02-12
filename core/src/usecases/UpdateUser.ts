import {
    SomeGroupNotFoundError,
    UserNotFoundError
} from "../common/functionalErrors";
import Usecase from "../common/Usecase";
import { Operation } from "../entities/OperationLog";
import { IUser } from "../entities/User";

type Arguments = [
    string,
    {
        name?: string;
        groupsIds?: string[];
    }
];
type ReturnValue = IUser;

export default class UpdateUser extends Usecase<Arguments, ReturnValue> {
    protected async _exec(
        id: Arguments[0],
        patch: Arguments[1]
    ): Promise<ReturnValue> {
        // Auth check
        this.authorizer.ensureCanUpdateUser();

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
            updatedAt: new Date()
        });

        // Log the operation
        await this.operationLogger.logOperation(Operation.UpdateUser, {
            oldUser: existingUser,
            newUser: updatedUser
        });

        return updatedUser;
    }
}
