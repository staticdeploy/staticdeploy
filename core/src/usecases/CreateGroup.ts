import { ConflictingGroupError } from "../common/functionalErrors";
import generateId from "../common/generateId";
import Usecase from "../common/Usecase";
import { IGroup } from "../entities/Group";
import { Operation } from "../entities/OperationLog";
import { validateRole } from "../entities/Role";

type Arguments = [
    {
        name: string;
        roles: string[];
    }
];
type ReturnValue = IGroup;

export default class CreateGroup extends Usecase<Arguments, ReturnValue> {
    protected async _exec(partial: Arguments[0]): Promise<ReturnValue> {
        // Auth check
        this.authorizer.ensureCanCreateGroup();

        // Validate roles
        partial.roles.forEach(validateRole);

        // Ensure no group with the same name exists
        const conflictingGroupExists = await this.storages.groups.oneExistsWithName(
            partial.name
        );
        if (conflictingGroupExists) {
            throw new ConflictingGroupError(partial.name);
        }

        // Create the group
        const now = new Date();
        const createdGroup = await this.storages.groups.createOne({
            id: generateId(),
            name: partial.name,
            roles: partial.roles,
            createdAt: now,
            updatedAt: now
        });

        // Log the operation
        await this.operationLogger.logOperation(Operation.CreateGroup, {
            createdGroup: createdGroup
        });

        return createdGroup;
    }
}
