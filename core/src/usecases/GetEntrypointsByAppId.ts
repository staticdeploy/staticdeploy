import Usecase from "../common/Usecase";
import { IEntrypoint } from "../entities/Entrypoint";

export default class GetEntrypointsByAppId extends Usecase {
    async exec(appId: string): Promise<IEntrypoint[]> {
        // Ensure the request is authenticated
        this.authorizer.ensureAuthenticated();

        return this.storages.entrypoints.findManyByAppId(appId);
    }
}
