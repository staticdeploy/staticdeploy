import Usecase from "../common/Usecase";
import { IBaseBundle } from "../entities/Bundle";

export default class GetBundles extends Usecase {
    async exec(): Promise<IBaseBundle[]> {
        // Ensure the request is authenticated
        this.authorizer.ensureAuthenticated();

        return this.storages.bundles.findMany();
    }
}
