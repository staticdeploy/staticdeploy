import Usecase from "../common/Usecase";

type Arguments = [string];
type ReturnValue = string[];

export default class GetBundleTagsByBundleName extends Usecase<
    Arguments,
    ReturnValue
> {
    protected async _exec(bundleName: Arguments[0]): Promise<ReturnValue> {
        // Auth check
        this.authorizer.ensureCanGetBundles();

        return this.storages.bundles.findManyTagsByName(bundleName);
    }
}
