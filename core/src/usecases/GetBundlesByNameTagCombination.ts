import Usecase from "../common/Usecase";
import { IBundle, splitNameTagCombination } from "../entities/Bundle";

export default class GetBundlesByNameTagCombination extends Usecase {
    async exec(nameTagCombination: string): Promise<IBundle[]> {
        // Ensure the request is authenticated
        this.authorizer.ensureAuthenticated();

        const [name, tag] = splitNameTagCombination(nameTagCombination);

        return this.storages.bundles.findManyByNameAndTag(name, tag);
    }
}
