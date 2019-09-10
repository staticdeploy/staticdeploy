import Usecase from "../common/Usecase";
import { IGroup } from "../entities/Group";

export default class GetGroups extends Usecase {
    async exec(): Promise<IGroup[]> {
        // Auth check
        await this.authorizer.ensureCanGetGroups();

        return this.storages.groups.findMany();
    }
}
