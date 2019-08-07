import { isEmpty } from "lodash";

import { ConflictingUserError, SomeGroupNotFoundError } from "../common/errors";
import generateId from "../common/generateId";
import Usecase from "../common/Usecase";
import { Operation } from "../entities/OperationLog";
import { IUser, UserType } from "../entities/User";

export default class CreateUser extends Usecase {
    async exec(partial: {
        idp: string;
        idpId: string;
        type: UserType;
        name: string;
        groupsIds: string[];
    }): Promise<IUser> {
        // Auth check
        await this.authorizer.ensureCanCreateUser();

        // Ensure no user with the same idp / idpId combination exists
        const conflictingUserExists = await this.storages.users.oneExistsWithIdpAndIdpId(
            partial.idp,
            partial.idpId
        );
        if (conflictingUserExists) {
            throw new ConflictingUserError(partial.idp, partial.idpId);
        }

        // Ensure all the linked groups exist
        if (
            !isEmpty(partial.groupsIds) &&
            !(await this.storages.groups.allExistWithIds(partial.groupsIds))
        ) {
            throw new SomeGroupNotFoundError(partial.groupsIds);
        }

        // Create the user
        const now = new Date();
        const createdUser = await this.storages.users.createOne({
            id: generateId(),
            name: partial.name,
            idp: partial.idp,
            idpId: partial.idpId,
            type: partial.type,
            groupsIds: [],
            createdAt: now,
            updatedAt: now
        });

        // Log the operation
        await this.operationLogger.logOperation(Operation.CreateUser, {
            createdUser: createdUser
        });

        return createdUser;
    }
}
