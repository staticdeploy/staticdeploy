import { ExternalCacheNotFoundError } from "../common/errors";
import Usecase from "../common/Usecase";
import { IExternalCache } from "../entities/ExternalCache";

export default class GetExternalCache extends Usecase {
    async exec(id: string): Promise<IExternalCache> {
        // Auth check
        await this.authorizer.ensureCanGetExternalCaches();

        const externalCache = await this.storages.externalCaches.findOne(id);

        // Ensure the externalCache exists
        if (!externalCache) {
            throw new ExternalCacheNotFoundError(id);
        }

        return externalCache;
    }
}
