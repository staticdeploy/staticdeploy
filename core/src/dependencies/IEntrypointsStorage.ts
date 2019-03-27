import { IConfiguration } from "../entities/Configuration";
import { IEntrypoint } from "../entities/Entrypoint";
import { IHealthCheckResult } from "../entities/HealthCheckResult";

export default interface IEntrypointsStorage {
    findOne(id: string): Promise<IEntrypoint | null>;
    findOneByUrlMatcher(urlMatcher: string): Promise<IEntrypoint | null>;
    findManyByAppId(appId: string): Promise<IEntrypoint[]>;
    findManyByBundleId(bundleId: string): Promise<IEntrypoint[]>;
    findManyByBundleIds(bundleIds: string[]): Promise<IEntrypoint[]>;
    findManyByUrlMatcherHostname(
        urlMatcherHostname: string
    ): Promise<IEntrypoint[]>;
    createOne(entrypoint: {
        id: string;
        appId: string;
        bundleId: string | null;
        redirectTo: string | null;
        urlMatcher: string;
        configuration: IConfiguration | null;
        createdAt: Date;
        updatedAt: Date;
    }): Promise<IEntrypoint>;
    updateOne(
        id: string,
        patch: {
            appId?: string;
            bundleId?: string | null;
            redirectTo?: string | null;
            urlMatcher?: string;
            configuration?: IConfiguration | null;
            updatedAt: Date;
        }
    ): Promise<IEntrypoint>;
    deleteOne(id: string): Promise<void>;
    deleteManyByAppId(appId: string): Promise<void>;
    checkHealth(): Promise<IHealthCheckResult>;
}
