import Usecase from "../common/Usecase";
import { IBundle } from "../entities/Bundle";

export default class GetBundlesByNameAndTag extends Usecase {
    async exec(name: string, tag: string): Promise<IBundle[]> {
        // Ensure the request is authenticated
        this.authorizer.ensureAuthenticated();

        return this.storages.bundles.findManyByNameAndTag(name, tag);
    }
}
