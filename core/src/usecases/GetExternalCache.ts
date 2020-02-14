import { ExternalCacheNotFoundError } from "../common/functionalErrors";
import Usecase from "../common/Usecase";
import { IExternalCache } from "../entities/ExternalCache";

type Arguments = [string];
type ReturnValue = IExternalCache;

export default class GetExternalCache extends Usecase<Arguments, ReturnValue> {
    protected async _exec(id: Arguments[0]): Promise<ReturnValue> {
        // Auth check
        this.authorizer.ensureCanGetExternalCaches();

        const externalCache = await this.storages.externalCaches.findOne(id);

        // Ensure the externalCache exists
        if (!externalCache) {
            throw new ExternalCacheNotFoundError(id);
        }

        return externalCache;
    }
}
