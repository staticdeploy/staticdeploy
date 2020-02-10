import { IExternalCache, IExternalCacheType } from "../entities/ExternalCache";

export default interface IExternalCacheService {
    externalCacheType: IExternalCacheType;
    purge(configuration: IExternalCache["configuration"]): Promise<void>;
}
