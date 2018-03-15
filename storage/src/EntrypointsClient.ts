import { isAbsolute, normalize } from "path";
import { isFQDN } from "validator";

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

    private App: IModels["App"];
    private Bundle: IModels["Bundle"];
    private Entrypoint: IModels["Entrypoint"];

    constructor(options: { models: IModels }) {
        this.App = options.models.App;
        this.Bundle = options.models.Bundle;
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
        bundleId?: string;
        urlMatcher: string;
        configuration?: IConfiguration;
    }): Promise<IEntrypoint> {
        // Ensure the linked app exists
        const linkedApp = await this.App.findById(partial.appId);
        if (!linkedApp) {
            throw new errors.AppNotFoundError(partial.appId);
        }

        // Ensure the linked bundle exists
        if (partial.bundleId) {
            const linkedBundle = await this.Bundle.findById(partial.bundleId);
            if (!linkedBundle) {
                throw new errors.BundleNotFoundError(partial.bundleId);
            }
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

        // Create the entrypoint
        const entrypoint = await this.Entrypoint.create({
            id: generateId(),
            appId: partial.appId,
            bundleId: partial.bundleId || null,
            urlMatcher: partial.urlMatcher,
            configuration: partial.configuration || null
        });

        return toPojo(entrypoint);
    }

    async update(
        id: string,
        patch: {
            appId?: string;
            bundleId?: string;
            urlMatcher?: string;
            configuration?: IConfiguration | null;
        }
    ): Promise<IEntrypoint> {
        const entrypoint = await this.Entrypoint.findById(id);

        // Ensure the entrypoint exists
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

        // Ensure the linked bundle exists
        if (patch.bundleId) {
            const linkedBundle = await this.Bundle.findById(patch.bundleId);
            if (!linkedBundle) {
                throw new errors.BundleNotFoundError(patch.bundleId);
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

        // Update the entrypoint
        await entrypoint.update(patch);

        return toPojo(entrypoint);
    }

    async delete(id: string): Promise<void> {
        const entrypoint = await this.Entrypoint.findById(id);

        // Ensure the entrypoint exists
        if (!entrypoint) {
            throw new errors.EntrypointNotFoundError(id);
        }

        // Delete the entrypoint
        await entrypoint.destroy();
    }
}
