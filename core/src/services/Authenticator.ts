import { reduce } from "bluebird";

import IAuthenticationStrategy from "../dependencies/IAuthenticationStrategy";
import { IIdpUser } from "../entities/User";

export default class Authenticator {
    constructor(
        private authenticationStrategies: IAuthenticationStrategy[],
        private authToken: string | null
    ) {}

    async getIdpUser(): Promise<IIdpUser | null> {
        if (!this.authToken) {
            return null;
        }
        return reduce<IAuthenticationStrategy, IIdpUser | null>(
            this.authenticationStrategies,
            (idpUser, authenticationStrategy) =>
                idpUser ||
                authenticationStrategy.getIdpUserFromAuthToken(this.authToken!),
            null
        );
    }
}
