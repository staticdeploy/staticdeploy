import Usecase from "../common/Usecase";
import { IExternalCache } from "../entities/ExternalCache";

type Arguments = [];
type ReturnValue = IExternalCache[];

export default class GetExternalCaches extends Usecase<Arguments, ReturnValue> {
    protected async _exec(): Promise<ReturnValue> {
        // Auth check
        this.authorizer.ensureCanGetExternalCaches();

        return this.storages.externalCaches.findMany();
    }
}
