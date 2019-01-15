import { IBundle } from "@staticdeploy/common-types";
import { S3 } from "aws-sdk";
import { mkdirp, remove } from "fs-extra";
import { flatten, isEmpty, map, reduce, some } from "lodash";
import md5 from "md5";
import { isMatch } from "micromatch";
import { getType } from "mime";
import { readFile, writeFile } from "mz/fs";
import { tmpdir } from "os";
import { join } from "path";
import recursiveReaddir from "recursive-readdir";
import tar from "tar";

import { IModels } from "./models";
import concurrentForEach from "./utils/concurrentForEach";
import * as errors from "./utils/errors";
import generateId from "./utils/generateId";
import removePrefix from "./utils/removePrefix";
import { eq, valueIn } from "./utils/sequelizeOperators";
import toPojo from "./utils/toPojo";
import * as validators from "./utils/validators";

// Directory on the filesystem where bundles' targz-s are unpacked before their
// files are uploaded to S3
const baseUnpackingDirPath = join(tmpdir(), "staticdeploy/storage");

export default class BundlesClient {
    static formNameTagCombination(name: string, tag: string): string {
        return `${name}:${tag}`;
    }

    static splitNameTagCombination(
        nameTagCombination: string
    ): [string, string] {
        validators.validateBundleNameTagCombination(nameTagCombination);
        return nameTagCombination.split(":") as [string, string];
    }

    private Bundle: IModels["Bundle"];
    private Entrypoint: IModels["Entrypoint"];
    private s3Client: S3;
    private s3Bucket: string;

    constructor(options: { models: IModels; s3Client: S3; s3Bucket: string }) {
        this.Bundle = options.models.Bundle;
        this.Entrypoint = options.models.Entrypoint;
        this.s3Client = options.s3Client;
        this.s3Bucket = options.s3Bucket;
    }

    async findOneById(id: string): Promise<IBundle | null> {
        const bundle = await this.Bundle.findByPk(id);
        return toPojo(bundle);
    }

    async findNames(): Promise<string[]> {
        // Aggregating with DISTINCT, sequelize produces the following query:
        //   SELECT DISTINCT(`name`) AS `DISTINCT` FROM `bundles` AS `bundle`
        // Specifying plain=false as an option, we get back the raw result of
        // the query, an array of { DISTINCT: string } rows, from which we then
        // extract the result we're interested in
        const result: { DISTINCT: string }[] = (await this.Bundle.aggregate(
            "name",
            "DISTINCT",
            { plain: false }
        )) as any;
        return map(result, "DISTINCT");
    }

    async findTagsByName(name: string): Promise<string[]> {
        const result: { DISTINCT: string }[] = (await this.Bundle.aggregate(
            "tag",
            "DISTINCT",
            { plain: false, where: { name: eq(name) } }
        )) as any;
        return map(result, "DISTINCT");
    }

    // Many bundles can have the same name:tag combination. The "latest" bundle
    // for a name:tag combination is the newest bundle (by createdAt) having
    // that combination
    async findLatestByNameTagCombination(
        nameTagCombination: string
    ): Promise<IBundle | null> {
        const [name, tag] = BundlesClient.splitNameTagCombination(
            nameTagCombination
        );
        const bundle = await this.Bundle.findOne({
            where: { name: eq(name), tag: eq(tag) },
            order: [["createdAt", "DESC"]]
        });
        return toPojo(bundle);
    }

    async findByNameTagCombination(
        nameTagCombination: string
    ): Promise<IBundle[]> {
        const [name, tag] = BundlesClient.splitNameTagCombination(
            nameTagCombination
        );
        const bundles = await this.Bundle.findAll({
            where: { name: eq(name), tag: eq(tag) }
        });
        return bundles.map(toPojo);
    }

    async findAll(): Promise<IBundle[]> {
        const bundles = await this.Bundle.findAll();
        return bundles.map(toPojo);
    }

    async create(partial: {
        name: string;
        tag: string;
        description: string;
        content: Buffer;
        fallbackAssetPath: string;
        fallbackStatusCode: number;
        headers: {
            [assetMatcher: string]: {
                [headerName: string]: string;
            };
        };
    }): Promise<IBundle> {
        // Validate name and tag
        validators.validateBundleNameOrTag(partial.name, "name");
        validators.validateBundleNameOrTag(partial.tag, "tag");

        // Generate an id for the bundle
        const id = generateId();

        // Unpack the bundle content to a temporary directory on the filesystem
        const unpackingDirPath = join(baseUnpackingDirPath, id);
        await mkdirp(unpackingDirPath);
        const targzPath = join(unpackingDirPath, "content.tar.gz");
        const rootPath = join(unpackingDirPath, "root");
        await mkdirp(rootPath);
        await writeFile(targzPath, partial.content);
        // If the content Buffer is not a valid archive, tar.extract doesn't
        // throw any error, and just doesn't extract anything
        await tar.extract({ cwd: rootPath, file: targzPath });

        // Build the assets list
        const localPaths = await recursiveReaddir(rootPath);
        const assets = localPaths.map(localPath => {
            const path = removePrefix(localPath, rootPath);
            return {
                path: path,
                mimeType: getType(localPath) || "application/octet-stream",
                // partial.headers is a ( assetMatcher, headers ) map. Build the
                // asset's headers object by merging all headers objects in the
                // map whose asset matcher matches the asset path
                headers: reduce(
                    partial.headers,
                    (finalHeaders, headers, assetMatcher) => ({
                        ...finalHeaders,
                        ...(isMatch(path, assetMatcher) ? headers : null)
                    }),
                    {}
                )
            };
        });

        // Ensure the fallbackAssetPath corresponds to an asset in the bundle
        if (!some(assets, { path: partial.fallbackAssetPath })) {
            throw new errors.BundleFallbackAssetNotFound(
                partial.fallbackAssetPath
            );
        }

        // Upload files to S3
        await concurrentForEach(assets, async asset => {
            const assetContent = await readFile(join(rootPath, asset.path));
            await this.s3Client
                .putObject({
                    Bucket: this.s3Bucket,
                    Body: assetContent,
                    Key: this.getAssetS3Key(id, asset.path)
                })
                .promise();
        });

        // Remove the temporary unpacking directory
        await remove(unpackingDirPath);

        // Create the bundle database object
        const bundle = await this.Bundle.create({
            id: id,
            name: partial.name,
            tag: partial.tag,
            description: partial.description,
            hash: md5(partial.content),
            assets: assets,
            fallbackAssetPath: partial.fallbackAssetPath,
            fallbackStatusCode: partial.fallbackStatusCode
        });

        return toPojo(bundle);
    }

    async delete(id: string): Promise<void> {
        const bundle = await this.Bundle.findByPk(id);

        // Ensure the bundle exists
        if (!bundle) {
            throw new errors.BundleNotFoundError(id, "id");
        }

        // Ensure the bundle is not used by any entrypoint
        const dependentEntrypoints = await this.Entrypoint.findAll({
            where: { bundleId: eq(id) }
        });
        if (!isEmpty(dependentEntrypoints)) {
            throw new errors.BundleInUseError(
                id,
                dependentEntrypoints.map(entrypoint => entrypoint.get("id"))
            );
        }

        // Delete bundle files on S3
        const assets: IBundle["assets"] = bundle.get("assets");
        await this.s3Client
            .deleteObjects({
                Bucket: this.s3Bucket,
                Delete: {
                    Objects: assets.map(asset => ({
                        Key: this.getAssetS3Key(id, asset.path)
                    }))
                }
            })
            .promise();

        // Delete the bundle from the database
        await bundle.destroy();
    }

    async deleteByNameTagCombination(
        nameTagCombination: string
    ): Promise<void> {
        const [name, tag] = BundlesClient.splitNameTagCombination(
            nameTagCombination
        );

        // Find bundles to be deleted
        const bundles = await this.findByNameTagCombination(nameTagCombination);
        const bundleIds = map(bundles, "id");

        // Ensure the bundles are not used by any entrypoint
        const dependentEntrypoints = await this.Entrypoint.findAll({
            where: { bundleId: valueIn(bundleIds) }
        });
        if (!isEmpty(dependentEntrypoints)) {
            throw new errors.BundlesInUseError(
                bundleIds,
                dependentEntrypoints.map(entrypoint => entrypoint.get("id"))
            );
        }

        // Delete bundles' files on S3
        await this.s3Client
            .deleteObjects({
                Bucket: this.s3Bucket,
                Delete: {
                    Objects: flatten(
                        map(bundles, bundle =>
                            map(bundle.assets, asset => ({
                                Key: this.getAssetS3Key(bundle.id, asset.path)
                            }))
                        )
                    )
                }
            })
            .promise();

        // Delete the bundles from the database
        await this.Bundle.destroy({
            where: { name: eq(name), tag: eq(tag) }
        });
    }

    async getBundleAssetContent(id: string, path: string): Promise<Buffer> {
        // Ensure the bundle exists
        const bundle = await this.Bundle.findByPk(id);
        if (!bundle) {
            throw new errors.BundleNotFoundError(id, "id");
        }

        // Ensure the asset exists
        const assets: IBundle["assets"] = bundle.get("assets");
        const requestedAsset = assets.find(asset => asset.path === path);
        if (!requestedAsset) {
            throw new errors.BundleAssetNotFoundError(id, path);
        }

        // Retrieve the asset from S3
        const assetS3Key = this.getAssetS3Key(id, path);
        const s3Object = await this.s3Client
            .getObject({ Bucket: this.s3Bucket, Key: assetS3Key })
            .promise();

        // Return the asset content
        return s3Object.Body as Buffer;
    }

    private getAssetS3Key(bundleId: string, assetPath: string) {
        // When using minio.io as an S3 server, keys can't have a leading /
        // (unlike in AWS S3), so we omit it
        return join(bundleId, assetPath);
    }
}
