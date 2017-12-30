import { isAbsolute, normalize } from "path";
import { isFQDN } from "validator";

import DeploymentsClient from "./DeploymentsClient";
import { IModels } from "./models";
import IConfiguration from "./types/IConfiguration";
import IEntrypoint from "./types/IEntrypoint";
import * as errors from "./utils/errors";
import generateId from "./utils/generateId";
import { eq, or } from "./utils/sequelizeOperators";
import toPojo from "./utils/toPojo";

export default class EntrypointsClient {
    /*
    *   A valid urlMatcher has the shape domain + path, where domain is a
    *   fully-qualified domain name, and path an absolute and normalized path
    *   ending with a /.
    *
    *   Example of valid urlMatchers:
    *   - domain.com/
    *   - domain.com/path/
    *   - subdomain.domain.com/path/subpath/
    *
    *   Example of invalid urlMatchers:
    *   - http://domain.com/
    *   - domain.com
    *   - domain.com/path
    */
    static isUrlMatcherValid(urlMatcher: string): boolean {
        const indexOfFirstSlash = urlMatcher.indexOf("/");
        // Must contain at least a / to be valid
        if (indexOfFirstSlash === -1) {
            return false;
        }
        const domain = urlMatcher.slice(0, indexOfFirstSlash);
        const path = urlMatcher.slice(indexOfFirstSlash);
        return (
            isFQDN(domain) &&
            isAbsolute(path) &&
            normalize(path) === path &&
            /\/$/.test(path)
        );
    }

    static validateUrlMatcher(urlMatcher: string): void {
        if (!EntrypointsClient.isUrlMatcherValid(urlMatcher)) {
            throw new errors.UrlMatcherNotValidError(urlMatcher);
        }
    }

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
            where: or([
                { id: eq(idOrUrlMatcher) },
                { urlMatcher: eq(idOrUrlMatcher) }
            ])
        });
        return toPojo(entrypoint);
    }

    async findManyByAppId(appId: string): Promise<IEntrypoint[]> {
        const entrypoints = await this.Entrypoint.findAll({
            where: { appId: eq(appId) }
        });
        return entrypoints.map(toPojo);
    }

    async findAll(): Promise<IEntrypoint[]> {
        const entrypoints = await this.Entrypoint.findAll();
        return entrypoints.map(toPojo);
    }

    async create(partial: {
        appId: string;
        urlMatcher: string;
        fallbackResource?: string;
        configuration?: IConfiguration;
    }): Promise<IEntrypoint> {
        // Ensure the linked app exists
        const linkedApp = await this.App.findById(partial.appId);
        if (!linkedApp) {
            throw new errors.AppNotFoundError(partial.appId);
        }

        // Validate the urlMatcher
        EntrypointsClient.validateUrlMatcher(partial.urlMatcher);

        // Ensure no entrypoint with the same urlMatcher exists
        const conflictingEntrypoint = await this.Entrypoint.findOne({
            where: { urlMatcher: eq(partial.urlMatcher) }
        });
        if (conflictingEntrypoint) {
            throw new errors.ConflictingEntrypointError(partial.urlMatcher);
        }

        const entrypoint = await this.Entrypoint.create({
            id: generateId(),
            appId: partial.appId,
            urlMatcher: partial.urlMatcher,
            fallbackResource: partial.fallbackResource || "/index.html",
            configuration: partial.configuration || null,
            activeDeploymentId: null
        });
        return toPojo(entrypoint);
    }

    async update(
        id: string,
        patch: {
            appId?: string;
            urlMatcher?: string;
            fallbackResource?: string;
            configuration?: IConfiguration | null;
            activeDeploymentId?: string | null;
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

        // Validate the urlMatcher
        if (patch.urlMatcher) {
            EntrypointsClient.validateUrlMatcher(patch.urlMatcher);
        }

        // Ensure no entrypoint with the same urlMatcher exists
        if (
            patch.urlMatcher &&
            patch.urlMatcher !== entrypoint.get("urlMatcher")
        ) {
            const conflictingEntrypoint = await this.Entrypoint.findOne({
                where: { urlMatcher: eq(patch.urlMatcher) }
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
