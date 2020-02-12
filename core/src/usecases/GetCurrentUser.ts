import Usecase from "../common/Usecase";
import { IUserWithRoles } from "../entities/User";

type Arguments = [];
type ReturnValue = IUserWithRoles | null;

export default class GetCurrentUser extends Usecase<Arguments, ReturnValue> {
    protected async _exec(): Promise<ReturnValue> {
        return this.user;
    }
}
