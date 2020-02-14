import { UserNotFoundError } from "../common/functionalErrors";
import Usecase from "../common/Usecase";
import { IUserWithGroups } from "../entities/User";

type Arguments = [string];
type ReturnValue = IUserWithGroups;

export default class GetUser extends Usecase<Arguments, ReturnValue> {
    protected async _exec(id: Arguments[0]): Promise<ReturnValue> {
        // Auth check
        this.authorizer.ensureCanGetUsers();

        const user = await this.storages.users.findOneWithGroups(id);

        // Ensure the user exists
        if (!user) {
            throw new UserNotFoundError(id);
        }

        return user;
    }
}
