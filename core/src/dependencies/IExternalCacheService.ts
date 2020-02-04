import { IExternalCache } from "../entities/ExternalCache";

export default interface IExternalCacheService {
    type: string;
    purge(configuration: IExternalCache["configuration"]): Promise<void>;
}
