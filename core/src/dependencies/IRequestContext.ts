import { IUser } from "../entities/User";

export default interface IRequestContext {
    user: IUser | null;
}
