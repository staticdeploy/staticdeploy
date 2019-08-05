import Usecase from "../common/Usecase";
import { IBaseBundle } from "../entities/Bundle";

export default class GetBundles extends Usecase {
    async exec(): Promise<IBaseBundle[]> {
        // Auth check
        await this.authorizer.ensureCanGetBundles();

        return this.storages.bundles.findMany();
    }
}
