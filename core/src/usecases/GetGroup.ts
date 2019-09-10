import { GroupNotFoundError } from "../common/errors";
import Usecase from "../common/Usecase";
import { IGroup } from "../entities/Group";

export default class GetGroup extends Usecase {
    async exec(id: string): Promise<IGroup> {
        // Auth check
        await this.authorizer.ensureCanGetGroups();

        const group = await this.storages.groups.findOne(id);

        // Ensure the group exists
        if (!group) {
            throw new GroupNotFoundError(id);
        }

        return group;
    }
}
