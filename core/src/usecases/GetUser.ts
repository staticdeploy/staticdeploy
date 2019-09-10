import { UserNotFoundError } from "../common/errors";
import Usecase from "../common/Usecase";
import { IUserWithGroups } from "../entities/User";

export default class GetUser extends Usecase {
    async exec(id: string): Promise<IUserWithGroups> {
        // Auth check
        await this.authorizer.ensureCanGetUsers();

        const user = await this.storages.users.findOneWithGroups(id);

        // Ensure the user exists
        if (!user) {
            throw new UserNotFoundError(id);
        }

        return user;
    }
}
