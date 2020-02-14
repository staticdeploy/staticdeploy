import Usecase from "../common/Usecase";
import { IUser } from "../entities/User";

type Arguments = [];
type ReturnValue = IUser[];

export default class GetUsers extends Usecase<Arguments, ReturnValue> {
    protected async _exec(): Promise<ReturnValue> {
        // Auth check
        this.authorizer.ensureCanGetUsers();

        return this.storages.users.findMany();
    }
}
