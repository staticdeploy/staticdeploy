import Usecase from "../common/Usecase";
import { IUser } from "../entities/User";

export default class GetCurrentUser extends Usecase {
    exec(): Promise<IUser | null> {
        return this.authorizer.getCurrentUser();
    }
}
