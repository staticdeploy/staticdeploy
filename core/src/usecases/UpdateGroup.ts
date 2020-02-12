import {
    ConflictingGroupError,
    GroupNotFoundError
} from "../common/functionalErrors";
import Usecase from "../common/Usecase";
import { IGroup } from "../entities/Group";
import { Operation } from "../entities/OperationLog";
import { validateRole } from "../entities/Role";

type Arguments = [
    string,
    {
        name?: string;
        roles?: string[];
    }
];
type ReturnValue = IGroup;

export default class UpdateGroup extends Usecase<Arguments, ReturnValue> {
    protected async _exec(
        id: Arguments[0],
        patch: Arguments[1]
    ): Promise<ReturnValue> {
        // Auth check
        this.authorizer.ensureCanUpdateGroup();

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
            updatedAt: new Date()
        });

        // Log the operation
        await this.operationLogger.logOperation(Operation.UpdateGroup, {
            oldGroup: existingGroup,
            newGroup: updatedGroup
        });

        return updatedGroup;
    }
}
