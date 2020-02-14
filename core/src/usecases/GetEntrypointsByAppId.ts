import { AppNotFoundError } from "../common/functionalErrors";
import Usecase from "../common/Usecase";
import { IEntrypoint } from "../entities/Entrypoint";

type Arguments = [string];
type ReturnValue = IEntrypoint[];

export default class GetEntrypointsByAppId extends Usecase<
    Arguments,
    ReturnValue
> {
    protected async _exec(appId: Arguments[0]): Promise<ReturnValue> {
        // Auth check
        this.authorizer.ensureCanGetEntrypoints();

        // Ensure the app with the specified id exists
        const appExists = await this.storages.apps.oneExistsWithId(appId);
        if (!appExists) {
            throw new AppNotFoundError(appId, "id");
        }

        return this.storages.entrypoints.findManyByAppId(appId);
    }
}
