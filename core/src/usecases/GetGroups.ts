import Usecase from "../common/Usecase";
import { IGroup } from "../entities/Group";

type Arguments = [];
type ReturnValue = IGroup[];

export default class GetGroups extends Usecase<Arguments, ReturnValue> {
    protected async _exec(): Promise<ReturnValue> {
        // Auth check
        this.authorizer.ensureCanGetGroups();

        return this.storages.groups.findMany();
    }
}
