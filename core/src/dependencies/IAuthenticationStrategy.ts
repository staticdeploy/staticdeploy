import { IIdpUser } from "../entities/User";

export default interface IAuthenticationStrategy {
    setup(): Promise<void>;
    getIdpUserFromAuthToken(authToken: string): Promise<IIdpUser | null>;
}
