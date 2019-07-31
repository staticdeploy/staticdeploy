import Usecase from "../common/Usecase";

export default class GetBundleTagsByBundleName extends Usecase {
    async exec(bundleName: string): Promise<string[]> {
        // Auth check
        this.authorizer.ensureCanGetBundles();

        return this.storages.bundles.findManyTagsByName(bundleName);
    }
}
