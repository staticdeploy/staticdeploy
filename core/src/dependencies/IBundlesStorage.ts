import { IAssetWithContent } from "../entities/Asset";
import { IBaseBundle, IBundleWithoutAssetsContent } from "../entities/Bundle";
import { IHealthCheckResult } from "../entities/HealthCheckResult";

export default interface IBundlesStorage {
    findOne(id: string): Promise<IBundleWithoutAssetsContent | null>;
    findLatestByNameAndTag(
        name: string,
        tag: string
    ): Promise<IBundleWithoutAssetsContent | null>;
    getBundleAssetContent(
        bundleId: string,
        assetPath: string
    ): Promise<Buffer | null>;
    findMany(): Promise<IBaseBundle[]>;
    findManyByNameAndTag(
        name: string,
        tag: string
    ): Promise<IBundleWithoutAssetsContent[]>;
    findManyBundleNames(): Promise<string[]>;
    findManyBundleTagsByBundleName(bundleName: string): Promise<string[]>;
    createOne(bundle: {
        id: string;
        name: string;
        tag: string;
        description: string;
        hash: string;
        assets: IAssetWithContent[];
        fallbackAssetPath: string;
        fallbackStatusCode: number;
        createdAt: Date;
    }): Promise<IBundleWithoutAssetsContent>;
    deleteOne(id: string): Promise<void>;
    deleteMany(ids: string[]): Promise<void>;
    checkHealth(): Promise<IHealthCheckResult>;
}
