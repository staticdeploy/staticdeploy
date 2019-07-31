import { BundleNotFoundError } from "../common/errors";
import Usecase from "../common/Usecase";
import { IBaseBundle } from "../entities/Bundle";

export default class GetBundle extends Usecase {
    async exec(id: string): Promise<IBaseBundle> {
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
