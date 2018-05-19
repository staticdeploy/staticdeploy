import { IConfiguration, IEntrypoint } from "@staticdeploy/common-types";

import { IModels } from "./models";
import * as errors from "./utils/errors";
import generateId from "./utils/generateId";
import { eq, or } from "./utils/sequelizeOperators";
import toPojo from "./utils/toPojo";
import * as validators from "./utils/validators";

export default class EntrypointsClient {
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
        bundleId?: string | null;
        redirectTo?: string | null;
        urlMatcher: string;
        configuration?: IConfiguration | null;
    }): Promise<IEntrypoint> {
        // Validate the urlMatcher and the configuration
        validators.validateEntrypointUrlMatcher(partial.urlMatcher);
        if (partial.configuration) {
            validators.validateConfiguration(
                partial.configuration,
                "configuration"
            );
        }

        // Ensure the linked app exists
        const linkedApp = await this.App.findById(partial.appId);
        if (!linkedApp) {
            throw new errors.AppNotFoundError(partial.appId, "id");
        }

        // Ensure the linked bundle exists
        if (partial.bundleId) {
            const linkedBundle = await this.Bundle.findById(partial.bundleId);
            if (!linkedBundle) {
                throw new errors.BundleNotFoundError(partial.bundleId, "id");
            }
        }

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
            redirectTo: partial.redirectTo || null,
            urlMatcher: partial.urlMatcher,
            configuration: partial.configuration || null
        });

        return toPojo(entrypoint);
    }

    async update(
        id: string,
        patch: {
            appId?: string;
            bundleId?: string | null;
            redirectTo?: string | null;
            urlMatcher?: string;
            configuration?: IConfiguration | null;
        }
    ): Promise<IEntrypoint> {
        // Validate the urlMatcher and the configuration
        if (patch.urlMatcher) {
            validators.validateEntrypointUrlMatcher(patch.urlMatcher);
        }
        if (patch.configuration) {
            validators.validateConfiguration(
                patch.configuration,
                "configuration"
            );
        }

        const entrypoint = await this.Entrypoint.findById(id);

        // Ensure the entrypoint exists
        if (!entrypoint) {
            throw new errors.EntrypointNotFoundError(id, "id");
        }

        // Ensure the linked app exists
        if (patch.appId) {
            const linkedApp = await this.App.findById(patch.appId);
            if (!linkedApp) {
                throw new errors.AppNotFoundError(patch.appId, "id");
            }
        }

        // Ensure the linked bundle exists
        if (patch.bundleId) {
            const linkedBundle = await this.Bundle.findById(patch.bundleId);
            if (!linkedBundle) {
                throw new errors.BundleNotFoundError(patch.bundleId, "id");
            }
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
            throw new errors.EntrypointNotFoundError(id, "id");
        }

        // Delete the entrypoint
        await entrypoint.destroy();
    }
}
