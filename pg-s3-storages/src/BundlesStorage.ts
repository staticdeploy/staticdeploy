import {
    IAssetWithContent,
    IBaseBundle,
    IBundlesStorage,
    IBundleWithoutAssetsContent,
} from "@staticdeploy/core";
import { S3 } from "aws-sdk";
import Knex from "knex";
import { flatten, map, omit } from "lodash";
import { join } from "path";

import concurrentForEach from "./common/concurrentForEach";
import convertErrors from "./common/convertErrors";
import tables from "./common/tables";

@convertErrors
export default class BundlesStorage implements IBundlesStorage {
    constructor(
        private knex: Knex,
        private s3Client: S3,
        private s3Bucket: string,
        private s3GoogleCloudStorageCompatible: boolean
    ) {}

    async findOne(id: string): Promise<IBundleWithoutAssetsContent | null> {
        const [bundle = null] = await this.knex(tables.bundles).where({ id });
        return bundle;
    }

    async findLatestByNameAndTag(
        name: string,
        tag: string
    ): Promise<IBundleWithoutAssetsContent | null> {
        const [bundle = null] = await this.knex(tables.bundles)
            .where({ name, tag })
            .orderBy("createdAt", "desc")
            .limit(1);
        return bundle;
    }

    async getBundleAssetContent(
        bundleId: string,
        assetPath: string
    ): Promise<Buffer | null> {
        const assetS3Key = this.getAssetS3Key(bundleId, assetPath);
        try {
            const s3Object = await this.s3Client
                .getObject({ Bucket: this.s3Bucket, Key: assetS3Key })
                .promise();
            return s3Object.Body as Buffer;
        } catch (err) {
            // If S3 returns a 404, return null
            if (err.statusCode === 404) {
                return null;
            }
            throw err;
        }
    }

    async findMany(): Promise<IBaseBundle[]> {
        const bundles = await this.knex(tables.bundles).select(
            "id",
            "name",
            "tag",
            "createdAt"
        );
        return bundles;
    }

    async findManyByNameAndTag(
        name: string,
        tag: string
    ): Promise<IBundleWithoutAssetsContent[]> {
        const bundles = await this.knex(tables.bundles).where({ name, tag });
        return bundles;
    }

    async findManyNames(): Promise<string[]> {
        const results = await this.knex(tables.bundles).distinct("name");
        return map(results, "name");
    }

    async findManyTagsByName(name: string): Promise<string[]> {
        const results = await this.knex(tables.bundles)
            .where({ name })
            .distinct("tag");
        return map(results, "tag");
    }

    async oneExistsWithId(id: string): Promise<boolean> {
        const [app = null] = await this.knex(tables.bundles)
            .select("id")
            .where({ id });
        return app !== null;
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
        // Upload files to S3
        await concurrentForEach(toBeCreatedBundle.assets, async (asset) => {
            await this.s3Client
                .putObject({
                    Bucket: this.s3Bucket,
                    Body: asset.content,
                    Key: this.getAssetS3Key(toBeCreatedBundle.id, asset.path),
                })
                .promise();
        });
        // Omit the assets' content before saving the bundle to sql
        const bundleWithoutAssetsContent = {
            ...toBeCreatedBundle,
            assets: JSON.stringify(
                toBeCreatedBundle.assets.map((asset) => omit(asset, "content"))
            ),
        };
        const [createdBundle] = await this.knex(tables.bundles)
            .insert(bundleWithoutAssetsContent)
            .returning("*");
        return createdBundle;
    }

    async deleteMany(ids: string[]): Promise<void> {
        const bundles: IBundleWithoutAssetsContent[] = await this.knex(
            tables.bundles
        ).whereIn("id", ids);
        // Delete bundles' files on S3
        await this.deleteObjects(bundles);
        // Delete the bundles from sql
        await this.knex(tables.bundles).whereIn("id", ids).delete();
    }

    private getAssetS3Key(bundleId: string, assetPath: string) {
        // When using minio.io as an S3 server, keys can't have a leading /
        // (unlike in AWS S3), so we omit it
        return join(bundleId, assetPath);
    }

    private async deleteObjects(bundles: IBundleWithoutAssetsContent[]) {
        if (this.s3GoogleCloudStorageCompatible) {
            await this.deleteObjectsIndividually(bundles);
            return;
        }
        await this.deleteObjectsInBatch(bundles);
    }

    private async deleteObjectsInBatch(bundles: IBundleWithoutAssetsContent[]) {
        await this.s3Client
            .deleteObjects({
                Bucket: this.s3Bucket,
                Delete: {
                    Objects: flatten(
                        map(bundles, (bundle) =>
                            map(bundle.assets, (asset) => ({
                                Key: this.getAssetS3Key(bundle.id, asset.path),
                            }))
                        )
                    ),
                },
            })
            .promise();
    }

    private async deleteObjectsIndividually(
        bundles: IBundleWithoutAssetsContent[]
    ) {
        await concurrentForEach(bundles, async (bundle) => {
            await concurrentForEach(bundle.assets, async (asset) => {
                await this.s3Client
                    .deleteObject({
                        Bucket: this.s3Bucket,
                        Key: this.getAssetS3Key(bundle.id, asset.path),
                    })
                    .promise();
            });
        });
    }
}
