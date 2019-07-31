import Usecase from "../common/Usecase";

export default class GetBundleNames extends Usecase {
    async exec(): Promise<string[]> {
        // Auth check
        this.authorizer.ensureCanGetBundles();

        return this.storages.bundles.findManyNames();
    }
}
