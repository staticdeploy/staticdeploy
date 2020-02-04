import Usecase from "../common/Usecase";
import { IExternalCache } from "../entities/ExternalCache";

export default class GetExternalCaches extends Usecase {
    async exec(): Promise<IExternalCache[]> {
        // Auth check
        await this.authorizer.ensureCanGetExternalCaches();

        return this.storages.externalCaches.findMany();
    }
}
