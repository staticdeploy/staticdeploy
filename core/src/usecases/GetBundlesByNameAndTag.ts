import Usecase from "../common/Usecase";
import { IBundle } from "../entities/Bundle";

export default class GetBundlesByNameAndTag extends Usecase {
    async exec(name: string, tag: string): Promise<IBundle[]> {
        // Auth check
        await this.authorizer.ensureCanGetBundles();

        return this.storages.bundles.findManyByNameAndTag(name, tag);
    }
}
