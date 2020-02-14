import { EntrypointNotFoundError } from "../common/functionalErrors";
import Usecase from "../common/Usecase";
import { IEntrypoint } from "../entities/Entrypoint";

type Arguments = [string];
type ReturnValue = IEntrypoint;

export default class GetEntrypoint extends Usecase<Arguments, ReturnValue> {
    protected async _exec(id: Arguments[0]): Promise<ReturnValue> {
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
