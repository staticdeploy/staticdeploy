import Sequelize = require("sequelize");

import DeploymentsClient from "./DeploymentsClient";
import { IModels } from "./models";
import IConfiguration from "./types/IConfiguration";
import IEntrypoint from "./types/IEntrypoint";
import * as errors from "./utils/errors";
import generateId from "./utils/generateId";
import toPojo from "./utils/toPojo";

export default class EntrypointsClient {
    private deploymentsClient: DeploymentsClient;
    private App: IModels["App"];
    private Deployment: IModels["Deployment"];
    private Entrypoint: IModels["Entrypoint"];

    constructor(options: {
        deploymentsClient: DeploymentsClient;
        models: IModels;
    }) {
        this.deploymentsClient = options.deploymentsClient;
        this.App = options.models.App;
        this.Deployment = options.models.Deployment;
        this.Entrypoint = options.models.Entrypoint;
    }

    async findOneById(id: string): Promise<IEntrypoint | null> {
        const entrypoint = await this.Entrypoint.findById(id);
        return toPojo(entrypoint);
    }

    async findOneByIdOrUrlMatcher(
        idOrUrlMatcher: string
    ): Promise<IEntrypoint | null> {
        const entrypoint = await this.Entrypoint.findOne({
            where: {
                [Sequelize.Op.or]: [
                    { id: idOrUrlMatcher },
                    { urlMatcher: idOrUrlMatcher }
                ]
            }
        });
        return toPojo(entrypoint);
    }

    async findManyByAppId(appId: string): Promise<IEntrypoint[]> {
        const entrypoints = await this.Entrypoint.findAll({ where: { appId } });
        return entrypoints.map(toPojo);
    }

    async findAll(): Promise<IEntrypoint[]> {
        const entrypoints = await this.Entrypoint.findAll();
        return entrypoints.map(toPojo);
    }

    async create(partial: {
        appId: string;
        urlMatcher: string;
        urlMatcherPriority?: number;
        smartRoutingEnabled?: boolean;
        configuration?: IConfiguration;
    }): Promise<IEntrypoint> {
        // Ensure the linked app exists
        const linkedApp = await this.App.findById(partial.appId);
        if (!linkedApp) {
            throw new errors.AppNotFoundError(partial.appId);
        }

        // Ensure no entrypoint with the same urlMatcher exists
        const conflictingEntrypoint = await this.Entrypoint.findOne({
            where: { urlMatcher: partial.urlMatcher }
        });
        if (conflictingEntrypoint) {
            throw new errors.ConflictingEntrypointError(partial.urlMatcher);
        }

        const entrypoint = await this.Entrypoint.create({
            ...partial,
            id: generateId()
        });
        return toPojo(entrypoint);
    }

    async update(
        id: string,
        patch: {
            appId?: string;
            urlMatcher?: string;
            urlMatcherPriority?: number;
            smartRoutingEnabled?: boolean;
            activeDeploymentId?: string | null;
            configuration?: IConfiguration | null;
        }
    ): Promise<IEntrypoint> {
        // Ensure the entrypoint exists
        const entrypoint = await this.Entrypoint.findById(id);
        if (!entrypoint) {
            throw new errors.EntrypointNotFoundError(id);
        }

        // Ensure the linked app exists
        if (patch.appId) {
            const linkedApp = await this.App.findById(patch.appId);
            if (!linkedApp) {
                throw new errors.AppNotFoundError(patch.appId);
            }
        }

        // Ensure the linked deployment exists
        if (patch.activeDeploymentId) {
            const linkedDeployment = await this.Deployment.findById(
                patch.activeDeploymentId
            );
            if (!linkedDeployment) {
                throw new errors.DeploymentNotFoundError(
                    patch.activeDeploymentId
                );
            }
        }

        // Ensure no entrypoint with the same urlMatcher exists
        if (
            patch.urlMatcher &&
            patch.urlMatcher !== entrypoint.get("urlMatcher")
        ) {
            const conflictingEntrypoint = await this.Entrypoint.findOne({
                where: { urlMatcher: patch.urlMatcher }
            });
            if (conflictingEntrypoint) {
                throw new errors.ConflictingEntrypointError(patch.urlMatcher);
            }
        }

        await entrypoint.update(patch);
        return toPojo(entrypoint);
    }

    async delete(id: string): Promise<void> {
        // Ensure the entrypoint exists
        const entrypoint = await this.Entrypoint.findById(id);
        if (!entrypoint) {
            throw new errors.EntrypointNotFoundError(id);
        }

        // Delete linked deployments
        const linkedDeployments = await this.deploymentsClient.findManyByEntrypointId(
            id
        );
        for (const deployment of linkedDeployments) {
            await this.deploymentsClient.delete(deployment.id);
        }

        await entrypoint.destroy();
    }
}
