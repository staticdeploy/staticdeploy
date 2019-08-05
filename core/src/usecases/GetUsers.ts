import Usecase from "../common/Usecase";
import { IUser } from "../entities/User";

export default class GetUsers extends Usecase {
    async exec(): Promise<IUser[]> {
        // Auth check
        await this.authorizer.ensureCanGetUsers();

        return this.storages.users.findMany();
    }
}
