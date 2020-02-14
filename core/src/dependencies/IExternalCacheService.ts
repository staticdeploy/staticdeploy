import { IExternalCache, IExternalCacheType } from "../entities/ExternalCache";

export default interface IExternalCacheService {
    externalCacheType: IExternalCacheType;
    purge(
        paths: string[],
        configuration: IExternalCache["configuration"]
    ): Promise<void>;
}
