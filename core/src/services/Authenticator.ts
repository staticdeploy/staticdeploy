import { reduce } from "bluebird";

import { NoUserCorrespondingToIdpUserError } from "../common/functionalErrors";
import IAuthenticationStrategy from "../dependencies/IAuthenticationStrategy";
import IUsersStorage from "../dependencies/IUsersStorage";
import { IIdpUser, IUserWithRoles } from "../entities/User";

export default class Authenticator {
    constructor(
        private users: IUsersStorage,
        private authenticationStrategies: IAuthenticationStrategy[],
        private enforceAuth: boolean,
        private authToken: string | null
    ) {}

    async getUser(): Promise<IUserWithRoles | null> {
        if (!this.enforceAuth) {
            return null;
        }

        const idpUser = await this.getIdpUser();
        if (!idpUser) {
            return null;
        }

        const user = await this.users.findOneWithRolesByIdpAndIdpId(
            idpUser.idp,
            idpUser.id
        );
        if (!user) {
            throw new NoUserCorrespondingToIdpUserError(idpUser);
        }

        return user;
    }

    private async getIdpUser(): Promise<IIdpUser | null> {
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
