import { EntrypointNotFoundError } from "../common/errors";
import Usecase from "../common/Usecase";
import { IEntrypoint } from "../entities/Entrypoint";

export default class GetEntrypoint extends Usecase {
    async exec(id: string): Promise<IEntrypoint> {
        // Auth check
        this.authorizer.ensureCanGetEntrypoints();

        const entrypoint = await this.storages.entrypoints.findOne(id);

        // Ensure the entrypoint exists
        if (!entrypoint) {
            throw new EntrypointNotFoundError(id, "id");
        }

        return entrypoint;
    }
}
