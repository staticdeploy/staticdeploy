import Usecase from "../common/Usecase";

type Arguments = [];
type ReturnValue = string[];

export default class GetBundleNames extends Usecase<Arguments, ReturnValue> {
    protected async _exec(): Promise<ReturnValue> {
        // Auth check
        this.authorizer.ensureCanGetBundles();

        return this.storages.bundles.findManyNames();
    }
}
