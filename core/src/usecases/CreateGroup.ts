import { ConflictingGroupError } from "../common/errors";
import generateId from "../common/generateId";
import Usecase from "../common/Usecase";
import { IGroup } from "../entities/Group";
import { Operation } from "../entities/OperationLog";
import { validateRole } from "../entities/Role";

export default class CreateGroup extends Usecase {
    async exec(partial: { name: string; roles: string[] }): Promise<IGroup> {
        // Auth check
        await this.authorizer.ensureCanCreateGroup();

        // Validate roles
        partial.roles.forEach(validateRole);

        // Ensure no group with the same name exists
        const conflictingGroupExists =
            await this.storages.groups.oneExistsWithName(partial.name);
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
            updatedAt: now,
        });

        // Log the operation
        await this.operationLogger.logOperation(Operation.CreateGroup, {
            createdGroup: createdGroup,
        });

        return createdGroup;
    }
}
