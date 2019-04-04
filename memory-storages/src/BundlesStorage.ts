import {
    IAssetWithContent,
    IBaseBundle,
    IBundle,
    IBundlesStorage,
    IBundleWithoutAssetsContent
} from "@staticdeploy/core";
import { filter, find, last, map, pick, sortBy, uniq } from "lodash";

import cloneMethodsIO from "./common/cloneMethodsIO";
import convertErrors from "./common/convertErrors";

@cloneMethodsIO
@convertErrors
export default class BundlesStorage implements IBundlesStorage {
    private bundles: { [id: string]: IBundle } = {};

    async findOne(id: string): Promise<IBundleWithoutAssetsContent | null> {
        const matchingBundle = this.bundles[id];
        return matchingBundle ? this.removeAssetsContent(matchingBundle) : null;
    }

    async findLatestByNameAndTag(
        name: string,
        tag: string
    ): Promise<IBundleWithoutAssetsContent | null> {
        const matchingBundles = filter(this.bundles, { name, tag });
        const matchingBundle = last(sortBy(matchingBundles, "createdAt"));
        return matchingBundle ? this.removeAssetsContent(matchingBundle) : null;
    }

    async getBundleAssetContent(
        bundleId: string,
        assetPath: string
    ): Promise<Buffer | null> {
        const matchingBundle = this.bundles[bundleId];
        if (!matchingBundle) {
            return null;
        }
        const matchingAsset = find(matchingBundle.assets, { path: assetPath });
        return matchingAsset ? matchingAsset.content! : null;
    }

    async findMany(): Promise<IBaseBundle[]> {
        return map(this.bundles, bundle =>
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

    async deleteOne(id: string): Promise<void> {
        delete this.bundles[id];
    }

    async deleteMany(ids: string[]): Promise<void> {
        for (const id of ids) {
            delete this.bundles[id];
        }
    }

    private removeAssetsContent(bundle: IBundle): IBundleWithoutAssetsContent {
        return {
            ...bundle,
            assets: bundle.assets.map(asset => ({
                ...asset,
                content: undefined
            }))
        };
    }
}
