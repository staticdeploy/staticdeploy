import { IIdpUser } from "../entities/User";

export default interface IRequestContext {
    idpUser: IIdpUser | null;
}
