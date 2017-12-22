import Sequelize = require("sequelize");

import DeploymentsClient from "./DeploymentsClient";
import { IModels } from "./models";
import IConfiguration from "./types/IConfiguration";
import IEntrypoint from "./types/IEntrypoint";
import generateId from "./utils/generateId";
import toPojo from "./utils/toPojo";

export default class EntrypointsClient {
    private deploymentsClient: DeploymentsClient;
    private Entrypoint: IModels["Entrypoint"];

    constructor(options: {
        deploymentsClient: DeploymentsClient;
        models: IModels;
    }) {
        this.deploymentsClient = options.deploymentsClient;
        this.Entrypoint = options.models.Entrypoint;
    }

    async findOneById(id: string): Promise<IEntrypoint | null> {
        const entrypoint = await this.Entrypoint.findById(id);
        return toPojo(entrypoint);
    }

    async findOneByUrlMatcher(urlMatcher: string): Promise<IEntrypoint | null> {
        const entrypoint = await this.Entrypoint.findOne({
            where: { urlMatcher }
        });
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
            activeDeploymentId?: string;
            configuration?: IConfiguration | null;
        }
    ): Promise<IEntrypoint> {
        const entrypoint = await this.Entrypoint.findById(id);
        if (!entrypoint) {
            throw new Error(`No entrypoint found with id = ${id}`);
        }
        await entrypoint.update(patch);
        return toPojo(entrypoint);
    }

    async delete(id: string): Promise<void> {
        const entrypoint = await this.Entrypoint.findById(id);
        if (!entrypoint) {
            throw new Error(`No entrypoint found with id = ${id}`);
        }
        const linkedDeployments = await this.deploymentsClient.findManyByEntrypointId(
            id
        );
        for (const deployment of linkedDeployments) {
            await this.deploymentsClient.delete(deployment.id);
        }
        await entrypoint.destroy();
    }
}
