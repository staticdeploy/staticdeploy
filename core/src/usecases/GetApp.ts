import { AppNotFoundError } from "../common/functionalErrors";
import Usecase from "../common/Usecase";
import { IApp } from "../entities/App";

type Arguments = [string];
type ReturnValue = IApp;

export default class GetApp extends Usecase<Arguments, ReturnValue> {
    protected async _exec(id: Arguments[0]): Promise<ReturnValue> {
        // Auth check
        this.authorizer.ensureCanGetApps();

        const app = await this.storages.apps.findOne(id);

        // Ensure the app exists
        if (!app) {
            throw new AppNotFoundError(id, "id");
        }

        return app;
    }
}
