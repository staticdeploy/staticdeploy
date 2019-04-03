import { map } from "bluebird";
import { mkdirp, readFile, remove, writeFile } from "fs-extra";
import { reduce, some } from "lodash";
import md5 from "md5";
import { isMatch } from "micromatch";
import { getType } from "mime";
import { tmpdir } from "os";
import { join } from "path";
import recursiveReaddir from "recursive-readdir";
import tar from "tar";
import { v4 } from "uuid";

import { BundleFallbackAssetNotFoundError } from "../common/errors";
import generateId from "../common/generateId";
import removePrefix from "../common/removePrefix";
import Usecase from "../common/Usecase";
import { IBundle, validateBundleNameOrTag } from "../entities/Bundle";
import { Operation } from "../entities/OperationLog";

interface IFile {
    path: string;
    content: Buffer;
}

export default class CreateBundle extends Usecase {
    async exec(partial: {
        name: string;
        tag: string;
        description: string;
        // tar archive of the bunlde
        content: Buffer;
        fallbackAssetPath: string;
        fallbackStatusCode: number;
        headers: {
            [assetMatcher: string]: {
                [headerName: string]: string;
            };
        };
    }): Promise<IBundle> {
        // Ensure the request is authenticated
        this.authorizer.ensureAuthenticated();

        // Validate name and tag
        validateBundleNameOrTag(partial.name, "name");
        validateBundleNameOrTag(partial.tag, "tag");

        // Generate an id for the bundle
        const id = generateId();

        // Build the assets list
        const files = await this.extractFiles(partial.content);
        const assets = files.map(file => {
            return {
                path: file.path,
                mimeType: getType(file.path) || "application/octet-stream",
                content: file.content,
                // partial.headers is a ( assetMatcher, headers ) map. Build the
                // asset's headers object by merging all headers objects in the
                // map whose asset matcher matches the asset path
                headers: reduce(
                    partial.headers,
                    (finalHeaders, headers, assetMatcher) => ({
                        ...finalHeaders,
                        ...(isMatch(file.path, assetMatcher) ? headers : null)
                    }),
                    {}
                )
            };
        });

        // Ensure the fallbackAssetPath corresponds to an asset in the bundle
        if (!some(assets, { path: partial.fallbackAssetPath })) {
            throw new BundleFallbackAssetNotFoundError(
                partial.fallbackAssetPath
            );
        }

        // Create the bundle database object
        const createdBundle = await this.storages.bundles.createOne({
            id: id,
            name: partial.name,
            tag: partial.tag,
            description: partial.description,
            hash: md5(partial.content),
            assets: assets,
            fallbackAssetPath: partial.fallbackAssetPath,
            fallbackStatusCode: partial.fallbackStatusCode,
            createdAt: new Date()
        });

        // Log the operation
        await this.operationLogger.logOperation(Operation.createBundle, {
            createdBundle
        });

        return createdBundle;
    }

    private async extractFiles(content: Buffer): Promise<IFile[]> {
        // Make a temporary directory on the filesystem for unpacking the bundle
        // content
        const unpackingDirPath = join(tmpdir(), "staticdeploy/storage", v4());
        await mkdirp(unpackingDirPath);

        // Write the tar archive to the filesystem
        const targzPath = join(unpackingDirPath, "content.tar.gz");
        await writeFile(targzPath, content);

        // Unpack the archive. If the content Buffer is not a valid archive,
        // tar.extract doesn't throw any error, and just doesn't extract
        // anything
        const rootPath = join(unpackingDirPath, "root");
        await mkdirp(rootPath);
        await tar.extract({ cwd: rootPath, file: targzPath });

        // Build the list of files unpacked from the archive
        const localPaths = await recursiveReaddir(rootPath);
        const files = await map(localPaths, async localPath => {
            const path = removePrefix(localPath, rootPath);
            return {
                path: path,
                content: await readFile(join(rootPath, path))
            };
        });

        // Remove the temporary unpacking directory
        await remove(unpackingDirPath);

        return files;
    }
}
