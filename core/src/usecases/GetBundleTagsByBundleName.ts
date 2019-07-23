import Usecase from "../common/Usecase";

export default class GetBundleTagsByBundleName extends Usecase {
    async exec(bundleName: string): Promise<string[]> {
        // Ensure the request is authenticated
        this.authorizer.ensureAuthenticated();

        return this.storages.bundles.findManyTagsByName(bundleName);
    }
}
