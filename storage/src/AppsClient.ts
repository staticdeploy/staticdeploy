import EntrypointsClient from "./EntrypointsClient";
import { IModels } from "./models";
import IApp from "./types/IApp";
import IConfiguration from "./types/IConfiguration";
import * as errors from "./utils/errors";
import generateId from "./utils/generateId";
import { eq, or } from "./utils/sequelizeOperators";
import toPojo from "./utils/toPojo";

export default class AppsClient {
    private App: IModels["App"];
    private entrypointsClient: EntrypointsClient;

    constructor(options: {
        entrypointsClient: EntrypointsClient;
        models: IModels;
    }) {
        this.entrypointsClient = options.entrypointsClient;
        this.App = options.models.App;
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
        // Ensure no app with the same name exists
        const conflictingApp = await this.App.findOne({
            where: { name: eq(partial.name) }
        });
        if (conflictingApp) {
            throw new errors.ConflictingAppError(partial.name);
        }

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
        // Ensure the app exists
        const app = await this.App.findById(id);
        if (!app) {
            throw new errors.AppNotFoundError(id);
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

        await app.update(patch);
        return toPojo(app);
    }

    async delete(id: string): Promise<void> {
        // Ensure the app exists
        const app = await this.App.findById(id);
        if (!app) {
            throw new errors.AppNotFoundError(id);
        }

        // Delete linked entrypoints
        const linkedEntrypoints = await this.entrypointsClient.findManyByAppId(
            id
        );
        for (const entrypoint of linkedEntrypoints) {
            await this.entrypointsClient.delete(entrypoint.id);
        }

        await app.destroy();
    }
}
