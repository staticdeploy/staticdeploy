import {
    IAssetWithContent,
    IBaseBundle,
    IBundle,
    IBundlesStorage,
    IBundleWithoutAssetsContent,
} from "@staticdeploy/core";
import { filter, find, last, map, pick, sortBy, uniq } from "lodash";

import cloneMethodsIO from "./common/cloneMethodsIO";
import convertErrors from "./common/convertErrors";
import { ICollection } from "./common/ICollection";

@cloneMethodsIO
@convertErrors
export default class BundlesStorage implements IBundlesStorage {
    constructor(private bundles: ICollection<IBundle>) {}

    async findOne(id: string): Promise<IBundleWithoutAssetsContent | null> {
        const bundle = this.bundles[id];
        return bundle ? this.removeAssetsContent(bundle) : null;
    }

    async findLatestByNameAndTag(
        name: string,
        tag: string
    ): Promise<IBundleWithoutAssetsContent | null> {
        const bundles = filter(this.bundles, { name, tag });
        const latestBundle = last(sortBy(bundles, "createdAt"));
        return latestBundle ? this.removeAssetsContent(latestBundle) : null;
    }

    async getBundleAssetContent(
        bundleId: string,
        assetPath: string
    ): Promise<Buffer | null> {
        const bundle = this.bundles[bundleId];
        if (!bundle) {
            return null;
        }
        const matchingAsset = find(bundle.assets, { path: assetPath });
        return matchingAsset ? matchingAsset.content! : null;
    }

    async findMany(): Promise<IBaseBundle[]> {
        return map(this.bundles, (bundle) =>
            pick(bundle, ["id", "name", "tag", "createdAt"])
        );
    }

    async findManyByNameAndTag(
        name: string,
        tag: string
    ): Promise<IBundleWithoutAssetsContent[]> {
        return map(
            filter(this.bundles, { name, tag }),
            this.removeAssetsContent
        );
    }

    async findManyNames(): Promise<string[]> {
        return uniq(map(this.bundles, "name"));
    }

    async findManyTagsByName(name: string): Promise<string[]> {
        return uniq(map(filter(this.bundles, { name }), "tag"));
    }

    async oneExistsWithId(id: string): Promise<boolean> {
        return !!this.bundles[id];
    }

    async createOne(toBeCreatedBundle: {
        id: string;
        name: string;
        tag: string;
        description: string;
        hash: string;
        assets: IAssetWithContent[];
        fallbackAssetPath: string;
        fallbackStatusCode: number;
        createdAt: Date;
    }): Promise<IBundleWithoutAssetsContent> {
        this.bundles[toBeCreatedBundle.id] = toBeCreatedBundle;
        return this.removeAssetsContent(toBeCreatedBundle);
    }

    async deleteMany(ids: string[]): Promise<void> {
        for (const id of ids) {
            delete this.bundles[id];
        }
    }

    private removeAssetsContent(bundle: IBundle): IBundleWithoutAssetsContent {
        return {
            ...bundle,
            assets: bundle.assets.map((asset) => ({
                ...asset,
                content: undefined,
            })),
        };
    }
}
