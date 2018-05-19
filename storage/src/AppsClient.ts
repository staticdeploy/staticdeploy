import { IApp, IConfiguration } from "@staticdeploy/common-types";

import { IModels } from "./models";
import * as errors from "./utils/errors";
import generateId from "./utils/generateId";
import { eq, or } from "./utils/sequelizeOperators";
import toPojo from "./utils/toPojo";
import * as validators from "./utils/validators";

export default class AppsClient {
    private App: IModels["App"];
    private Entrypoint: IModels["Entrypoint"];

    constructor(options: { models: IModels }) {
        this.App = options.models.App;
        this.Entrypoint = options.models.Entrypoint;
    }

    async findOneById(id: string): Promise<IApp | null> {
        const app = await this.App.findById(id);
        return toPojo(app);
    }

    async findOneByIdOrName(idOrName: string): Promise<IApp | null> {
        const app = await this.App.findOne({
            where: or([{ id: eq(idOrName) }, { name: eq(idOrName) }])
        });
        return toPojo(app);
    }

    async findAll(): Promise<IApp[]> {
        const apps = await this.App.findAll();
        return apps.map(toPojo);
    }

    async create(partial: {
        name: string;
        defaultConfiguration?: IConfiguration;
    }): Promise<IApp> {
        // Validate name and defaultConfiguration
        validators.validateAppName(partial.name);
        if (partial.defaultConfiguration) {
            validators.validateConfiguration(
                partial.defaultConfiguration,
                "defaultConfiguration"
            );
        }

        // Ensure no app with the same name exists
        const conflictingApp = await this.App.findOne({
            where: { name: eq(partial.name) }
        });
        if (conflictingApp) {
            throw new errors.ConflictingAppError(partial.name);
        }

        // Create the app
        const app = await this.App.create({
            id: generateId(),
            name: partial.name,
            defaultConfiguration: partial.defaultConfiguration || {}
        });

        return toPojo(app);
    }

    async update(
        id: string,
        patch: {
            name?: string;
            defaultConfiguration?: IConfiguration;
        }
    ): Promise<IApp> {
        // Validate name and defaultConfiguration
        if (patch.name) {
            validators.validateAppName(patch.name);
        }
        if (patch.defaultConfiguration) {
            validators.validateConfiguration(
                patch.defaultConfiguration,
                "defaultConfiguration"
            );
        }

        const app = await this.App.findById(id);

        // Ensure the app exists
        if (!app) {
            throw new errors.AppNotFoundError(id, "id");
        }

        // Ensure no app with the same name exists
        if (patch.name && patch.name !== app.get("name")) {
            const conflictingApp = await this.App.findOne({
                where: { name: eq(patch.name) }
            });
            if (conflictingApp) {
                throw new errors.ConflictingAppError(patch.name);
            }
        }

        // Update the app
        await app.update(patch);

        return toPojo(app);
    }

    async delete(id: string): Promise<void> {
        const app = await this.App.findById(id);

        // Ensure the app exists
        if (!app) {
            throw new errors.AppNotFoundError(id, "id");
        }

        // Delete linked entrypoints
        await this.Entrypoint.destroy({ where: { appId: eq(id) } });

        // Delete the app
        await app.destroy();
    }
}
