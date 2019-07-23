import { EntrypointNotFoundError } from "../common/errors";
import Usecase from "../common/Usecase";
import { IEntrypoint } from "../entities/Entrypoint";

export default class GetEntrypoint extends Usecase {
    async exec(id: string): Promise<IEntrypoint> {
        // Ensure the request is authenticated
        this.authorizer.ensureAuthenticated();

        const entrypoint = await this.storages.entrypoints.findOne(id);

        // Ensure the entrypoint exists
        if (!entrypoint) {
            throw new EntrypointNotFoundError(id, "id");
        }

        return entrypoint;
    }
}
