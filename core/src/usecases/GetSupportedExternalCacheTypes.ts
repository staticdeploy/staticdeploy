import Usecase from "../common/Usecase";
import { IExternalCacheType } from "../entities/ExternalCache";

export default class GetSupportedExternalCacheTypes extends Usecase {
    async exec(): Promise<IExternalCacheType[]> {
        // Auth check
        await this.authorizer.ensureCanGetExternalCaches();

        return this.externalCacheService.getSupportedExternalCacheTypes();
    }
}
