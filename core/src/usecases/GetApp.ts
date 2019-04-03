import { AppNotFoundError } from "../common/errors";
import Usecase from "../common/Usecase";
import { IApp } from "../entities/App";

export default class GetApp extends Usecase {
    async exec(id: string): Promise<IApp> {
        // Ensure the request is authenticated
        this.authorizer.ensureAuthenticated();

        const app = await this.storages.apps.findOne(id);

        // Ensure the app exists
        if (!app) {
            throw new AppNotFoundError(id, "id");
        }

        return app;
    }
}
