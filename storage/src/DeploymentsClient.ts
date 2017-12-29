import { remove, pathExists } from "fs-extra";
import { getType } from "mime";
import { mkdir, readFile, writeFile } from "mz/fs";
import { join, normalize } from "path";
import recursiveReaddir = require("recursive-readdir");
import tar = require("tar");

import { IModels } from "./models";
import IAsset from "./types/IAsset";
import IDeployment from "./types/IDeployment";
import * as errors from "./utils/errors";
import generateId from "./utils/generateId";
import removePrefix from "./utils/removePrefix";
import toPojo from "./utils/toPojo";

export default class DeploymentsClient {
    private Deployment: IModels["Deployment"];
    private Entrypoint: IModels["Entrypoint"];
    private deploymentsPath: string;

    constructor(options: { deploymentsPath: string; models: IModels }) {
        this.Entrypoint = options.models.Entrypoint;
        this.Deployment = options.models.Deployment;
        this.deploymentsPath = options.deploymentsPath;
    }

    async findOneById(id: string): Promise<IDeployment | null> {
        const deployment = await this.Deployment.findById(id);
        return toPojo(deployment);
    }

    async findManyByEntrypointId(entrypointId: string): Promise<IDeployment[]> {
        const deployments = await this.Deployment.findAll({
            where: { entrypointId }
        });
        return deployments.map(toPojo);
    }

    async findAll(): Promise<IDeployment[]> {
        const deployments = await this.Deployment.findAll();
        return deployments.map(toPojo);
    }

    async create(partial: {
        entrypointId: string;
        content: Buffer;
        description?: string;
    }): Promise<IDeployment> {
        // Ensure the linked entrypoint exists
        const linkedEntrypoint = await this.Entrypoint.findById(
            partial.entrypointId
        );
        if (!linkedEntrypoint) {
            throw new errors.EntrypointNotFoundError(partial.entrypointId);
        }

        const deployment = await this.Deployment.create({
            id: generateId(),
            entrypointId: partial.entrypointId,
            description: partial.description || null
        });

        // Unpack the deployment content
        const baseDeploymentPath = this.getBaseDeploymentPath(
            deployment.get("id")
        );
        const targzPath = join(baseDeploymentPath, "content.tar.gz");
        const rootPath = join(baseDeploymentPath, "root");
        await mkdir(baseDeploymentPath);
        await mkdir(rootPath);
        await writeFile(targzPath, partial.content);
        await tar.extract({ cwd: rootPath, file: targzPath });

        return toPojo(deployment);
    }

    async delete(id: string): Promise<void> {
        // Ensure the deployment exists
        const deployment = await this.Deployment.findById(id);
        if (!deployment) {
            throw new errors.DeploymentNotFoundError(id);
        }

        // Null-ify entrypoint links the deployment
        await this.Entrypoint.update(
            { activeDeploymentId: null },
            { where: { activeDeploymentId: deployment.get("id") } }
        );

        await deployment.destroy();
        const baseDeploymentPath = this.getBaseDeploymentPath(id);
        await remove(baseDeploymentPath);
    }

    async listDeploymentAssetsPaths(id: string): Promise<string[]> {
        // Ensure the deployment exists
        const deployment = await this.Deployment.findById(id);
        if (!deployment) {
            throw new errors.DeploymentNotFoundError(id);
        }

        const baseDeploymentPath = this.getBaseDeploymentPath(id);
        const rootPath = join(baseDeploymentPath, "root");
        const localPaths = await recursiveReaddir(rootPath);
        return localPaths.map(localPath => removePrefix(localPath, rootPath));
    }

    async getDeploymentAsset(id: string, path: string): Promise<IAsset> {
        // Ensure the deployment exists
        const deployment = await this.Deployment.findById(id);
        if (!deployment) {
            throw new errors.DeploymentNotFoundError(id);
        }

        const baseDeploymentPath = this.getBaseDeploymentPath(id);
        const rootPath = join(baseDeploymentPath, "root");
        const normalizedPath = normalize(join("/", path));
        const assetPath = join(rootPath, normalizedPath);

        // Ensure the asset exists
        if (!await pathExists(assetPath)) {
            throw new errors.DeploymentAssetNotFoundError(path);
        }

        return {
            path: normalizedPath,
            mimeType: getType(normalizedPath) || "application/octet-stream",
            content: await readFile(join(rootPath, normalizedPath))
        };
    }

    private getBaseDeploymentPath(id: string) {
        return join(this.deploymentsPath, id);
    }
}
