import { IIdpUser } from "../entities/User";

export default interface IAuthenticationStrategy {
    getIdpUserFromAuthToken(authToken: string): Promise<IIdpUser | null>;
}
