import { remove } from "fs-extra";
import { mkdir, writeFile } from "mz/fs";
import * as path from "path";
import tar = require("tar");

import IDeployment from "./types/IDeployment";
import generateId from "./utils/generateId";
import toPojo from "./utils/toPojo";

import { IModels } from "./models";

const getBaseDeploymentPath = (deploymentsPath: string, deploymentId: string) =>
    path.join(deploymentsPath, deploymentId);

export default class DeploymentsClient {
    private Deployment: IModels["Deployment"];
    private deploymentsPath: string;

    constructor(options: { deploymentsPath: string; models: IModels }) {
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
        const deployment = await this.Deployment.create({
            id: generateId(),
            entrypointId: partial.entrypointId,
            description: partial.description
        });

        // Unpack the deployment content
        const baseDeploymentPath = getBaseDeploymentPath(
            this.deploymentsPath,
            deployment.get("id")
        );
        const targzPath = path.join(baseDeploymentPath, "content.tar.gz");
        const rootPath = path.join(baseDeploymentPath, "root");
        await mkdir(baseDeploymentPath);
        await mkdir(rootPath);
        await writeFile(targzPath, partial.content);
        await tar.extract({ cwd: rootPath, file: targzPath });

        return toPojo(deployment);
    }

    async delete(id: string): Promise<void> {
        const deployment = await this.Deployment.findById(id);
        if (!deployment) {
            throw new Error(`No deployment found with id = ${id}`);
        }
        await deployment.destroy();
        const baseDeploymentPath = getBaseDeploymentPath(
            this.deploymentsPath,
            id
        );
        await remove(baseDeploymentPath);
    }
}
