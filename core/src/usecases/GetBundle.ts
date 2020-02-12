import { BundleNotFoundError } from "../common/functionalErrors";
import Usecase from "../common/Usecase";
import { IBaseBundle } from "../entities/Bundle";

type Arguments = [string];
type ReturnValue = IBaseBundle;

export default class GetBundle extends Usecase<Arguments, ReturnValue> {
    protected async _exec(id: Arguments[0]): Promise<ReturnValue> {
        // Auth check
        this.authorizer.ensureCanGetBundles();

        const bundle = await this.storages.bundles.findOne(id);

        // Ensure the bundle exists
        if (!bundle) {
            throw new BundleNotFoundError(id, "id");
        }

        return {
            id: bundle.id,
            name: bundle.name,
            tag: bundle.tag,
            createdAt: bundle.createdAt
        };
    }
}
