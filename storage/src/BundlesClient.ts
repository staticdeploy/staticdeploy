import { IBundle } from "@staticdeploy/common-types";
import { pathExists, remove } from "fs-extra";
import { isEmpty } from "lodash";
import md5 from "md5";
import { getType } from "mime";
import { mkdir, readFile, writeFile } from "mz/fs";
import { join, normalize } from "path";
import recursiveReaddir from "recursive-readdir";
import tar from "tar";

import { IModels } from "./models";
import * as errors from "./utils/errors";
import generateId from "./utils/generateId";
import removePrefix from "./utils/removePrefix";
import { eq } from "./utils/sequelizeOperators";
import toPojo from "./utils/toPojo";
import * as validators from "./utils/validators";

export default class BundlesClient {
    static splitNameTagCombination(
        nameTagCombination: string
    ): [string, string] {
        validators.validateBundleNameTagCombination(nameTagCombination);
        return nameTagCombination.split(":") as [string, string];
    }

    private Bundle: IModels["Bundle"];
    private Entrypoint: IModels["Entrypoint"];
    private bundlesPath: string;

    constructor(options: { models: IModels; bundlesPath: string }) {
        this.Bundle = options.models.Bundle;
        this.Entrypoint = options.models.Entrypoint;
        this.bundlesPath = options.bundlesPath;
    }

    async findOneById(id: string): Promise<IBundle | null> {
        const bundle = await this.Bundle.findById(id);
        return toPojo(bundle);
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

    async findAll(): Promise<IBundle[]> {
        const bundles = await this.Bundle.findAll();
        return bundles.map(toPojo);
    }

    async create(partial: {
        name: string;
        tag: string;
        description: string;
        content: Buffer;
    }): Promise<IBundle> {
        // Validate name and tag
        validators.validateBundleNameOrTag(partial.name, "name");
        validators.validateBundleNameOrTag(partial.tag, "tag");

        // Generate an id for the bundle
        const id = generateId();

        // Unpack the bundle content to the filesystem
        const baseBundlePath = this.getBaseBundlePath(id);
        const targzPath = join(baseBundlePath, "content.tar.gz");
        const rootPath = join(baseBundlePath, "root");
        await mkdir(baseBundlePath);
        await mkdir(rootPath);
        await writeFile(targzPath, partial.content);
        // If the content Buffer is not a valid archive, tar.extract doesn't
        // throw any error, and just doesn't extract anything
        await tar.extract({ cwd: rootPath, file: targzPath });

        // Build the assets list
        const localPaths = await recursiveReaddir(rootPath);
        const assets = localPaths.map(localPath => ({
            path: removePrefix(localPath, rootPath),
            mimeType: getType(localPath) || "application/octet-stream"
        }));

        // Create the bundle database object
        const bundle = await this.Bundle.create({
            id: id,
            name: partial.name,
            tag: partial.tag,
            description: partial.description,
            hash: md5(partial.content),
            assets: assets
        });

        return toPojo(bundle);
    }

    async delete(id: string): Promise<void> {
        const bundle = await this.Bundle.findById(id);

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

        // Delete the bundle from the database and from the filesystem
        await bundle.destroy();
        const baseBundlePath = this.getBaseBundlePath(id);
        await remove(baseBundlePath);
    }

    async getBundleAssetContent(id: string, path: string): Promise<Buffer> {
        // Ensure the bundle exists
        const bundle = await this.Bundle.findById(id);
        if (!bundle) {
            throw new errors.BundleNotFoundError(id, "id");
        }

        const baseBundlePath = this.getBaseBundlePath(id);
        const rootPath = join(baseBundlePath, "root");
        const normalizedPath = normalize(join("/", path));
        const assetPath = join(rootPath, normalizedPath);

        // Ensure the asset exists
        if (!(await pathExists(assetPath))) {
            throw new errors.BundleAssetNotFoundError(id, path);
        }

        // Return the asset content
        return readFile(join(rootPath, normalizedPath));
    }

    private getBaseBundlePath(id: string) {
        return join(this.bundlesPath, id);
    }
}
