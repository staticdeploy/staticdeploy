import Usecase from "../common/Usecase";
import { IBaseBundle } from "../entities/Bundle";

type Arguments = [];
type ReturnValue = IBaseBundle[];

export default class GetBundles extends Usecase<Arguments, ReturnValue> {
    protected async _exec(): Promise<ReturnValue> {
        // Auth check
        this.authorizer.ensureCanGetBundles();

        return this.storages.bundles.findMany();
    }
}
