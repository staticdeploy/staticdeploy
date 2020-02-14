import Usecase from "../common/Usecase";
import { IBundle } from "../entities/Bundle";

type Arguments = [string, string];
type ReturnValue = IBundle[];

export default class GetBundlesByNameAndTag extends Usecase<
    Arguments,
    ReturnValue
> {
    protected async _exec(
        name: Arguments[0],
        tag: Arguments[1]
    ): Promise<ReturnValue> {
        // Auth check
        this.authorizer.ensureCanGetBundles();

        return this.storages.bundles.findManyByNameAndTag(name, tag);
    }
}
