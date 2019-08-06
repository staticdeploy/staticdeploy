import { IAssetWithContent } from "../entities/Asset";
import { IBaseBundle, IBundleWithoutAssetsContent } from "../entities/Bundle";

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
    findManyNames(): Promise<string[]>;
    findManyTagsByName(name: string): Promise<string[]>;
    oneExistsWithId(id: string): Promise<boolean>;
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
    deleteMany(ids: string[]): Promise<void>;
}
