import { GroupNotFoundError } from "../common/functionalErrors";
import Usecase from "../common/Usecase";
import { IGroup } from "../entities/Group";

type Arguments = [string];
type ReturnValue = IGroup;

export default class GetGroup extends Usecase<Arguments, ReturnValue> {
    protected async _exec(id: Arguments[0]): Promise<ReturnValue> {
        // Auth check
        this.authorizer.ensureCanGetGroups();

        const group = await this.storages.groups.findOne(id);

        // Ensure the group exists
        if (!group) {
            throw new GroupNotFoundError(id);
        }

        return group;
    }
}
