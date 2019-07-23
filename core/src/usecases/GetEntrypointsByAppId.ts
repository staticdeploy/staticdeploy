import { AppNotFoundError } from "../common/errors";
import Usecase from "../common/Usecase";
import { IEntrypoint } from "../entities/Entrypoint";

export default class GetEntrypointsByAppId extends Usecase {
    async exec(appId: string): Promise<IEntrypoint[]> {
        // Ensure the request is authenticated
        this.authorizer.ensureAuthenticated();

        // Ensure the app with the specified id exists
        const app = await this.storages.apps.findOne(appId);
        if (!app) {
            throw new AppNotFoundError(appId, "id");
        }

        return this.storages.entrypoints.findManyByAppId(appId);
    }
}
