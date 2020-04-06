import { ConflictingGroupError, GroupNotFoundError } from "../common/errors";
import Usecase from "../common/Usecase";
import { IGroup } from "../entities/Group";
import { Operation } from "../entities/OperationLog";
import { validateRole } from "../entities/Role";

export default class UpdateGroup extends Usecase {
    async exec(
        id: string,
        patch: {
            name?: string;
            roles?: string[];
        }
    ): Promise<IGroup> {
        // Auth check
        await this.authorizer.ensureCanUpdateGroup();

        // Validate roles
        if (patch.roles) {
            patch.roles.forEach(validateRole);
        }

        const existingGroup = await this.storages.groups.findOne(id);

        // Ensure the group exists
        if (!existingGroup) {
            throw new GroupNotFoundError(id);
        }

        // Ensure no group with the same name exists
        if (patch.name && patch.name !== existingGroup.name) {
            const hasConflictingGroup = await this.storages.groups.oneExistsWithName(
                patch.name
            );
            if (hasConflictingGroup) {
                throw new ConflictingGroupError(patch.name);
            }
        }

        // Update the group
        const updatedGroup = await this.storages.groups.updateOne(id, {
            name: patch.name,
            roles: patch.roles,
            updatedAt: new Date(),
        });

        // Log the operation
        await this.operationLogger.logOperation(Operation.UpdateGroup, {
            oldGroup: existingGroup,
            newGroup: updatedGroup,
        });

        return updatedGroup;
    }
}
