import getSupportedExternalCacheTypes from "../common/getSupportedExternalCacheTypes";
import Usecase from "../common/Usecase";
import { IExternalCacheType } from "../entities/ExternalCache";

type Arguments = [];
type ReturnValue = IExternalCacheType[];

export default class GetSupportedExternalCacheTypes extends Usecase<
    Arguments,
    ReturnValue
> {
    protected async _exec(): Promise<ReturnValue> {
        this.authorizer.ensureCanGetExternalCaches();

        return getSupportedExternalCacheTypes(this.externalCacheServices);
    }
}
