import {
    AuthenticationRequiredError,
    MissingRoleError,
    NoUserCorrespondingToIdpUserError
} from "../common/errors";
import IUsersStorage from "../dependencies/IUsersStorage";
import { oneOfRolesMatchesRole, RoleName, RoleTuple } from "../entities/Role";
import { IUser, IUserWithRoles } from "../entities/User";
import Authenticator from "./Authenticator";

export default class Authorizer {
    private currentUser: IUserWithRoles | null = null;

    constructor(
        private users: IUsersStorage,
        private authenticator: Authenticator,
        private enforceAuth: boolean
    ) {}

    // Misc
    async canSeeHealtCheckDetails(): Promise<boolean> {
        try {
            await this.ensureAuthenticated();
            return true;
        } catch {
            return false;
        }
    }
    async getCurrentUser(): Promise<IUser | null> {
        await this.ensureAuthenticated();
        return this.currentUser;
    }

    // Apps
    ensureCanCreateApp(): Promise<void> {
        return this.ensureAuthorized(() => this.matchesRole([RoleName.Root]));
    }
    ensureCanUpdateApp(appName: string): Promise<void> {
        return this.ensureAuthorized(
            () =>
                this.matchesRole([RoleName.Root]) ||
                this.matchesRole([RoleName.AppManager, appName])
        );
    }
    ensureCanDeleteApp(appName: string): Promise<void> {
        return this.ensureAuthorized(
            () =>
                this.matchesRole([RoleName.Root]) ||
                this.matchesRole([RoleName.AppManager, appName])
        );
    }
    ensureCanGetApps(): Promise<void> {
        return this.ensureAuthenticated();
    }

    // Bundles
    ensureCanCreateBundle(bundleName: string): Promise<void> {
        return this.ensureAuthorized(
            () =>
                this.matchesRole([RoleName.Root]) ||
                this.matchesRole([RoleName.BundleManager, bundleName])
        );
    }
    ensureCanDeleteBundles(bundlesName: string): Promise<void> {
        return this.ensureAuthorized(
            () =>
                this.matchesRole([RoleName.Root]) ||
                this.matchesRole([RoleName.BundleManager, bundlesName])
        );
    }
    ensureCanGetBundles(): Promise<void> {
        return this.ensureAuthenticated();
    }

    // Entrypoints
    ensureCanCreateEntrypoint(
        entrypointUrlMatcher: string,
        entrypointAppName: string
    ): Promise<void> {
        return this.ensureAuthorized(
            () =>
                this.matchesRole([RoleName.Root]) ||
                (this.matchesRole([RoleName.AppManager, entrypointAppName]) &&
                    this.matchesRole([
                        RoleName.EntrypointManager,
                        entrypointUrlMatcher
                    ]))
        );
    }
    ensureCanUpdateEntrypoint(entrypointUrlMatcher: string): Promise<void> {
        return this.ensureAuthorized(
            () =>
                this.matchesRole([RoleName.Root]) ||
                this.matchesRole([
                    RoleName.EntrypointManager,
                    entrypointUrlMatcher
                ])
        );
    }
    ensureCanDeleteEntrypoint(entrypointUrlMatcher: string): Promise<void> {
        return this.ensureAuthorized(
            () =>
                this.matchesRole([RoleName.Root]) ||
                this.matchesRole([
                    RoleName.EntrypointManager,
                    entrypointUrlMatcher
                ])
        );
    }
    ensureCanGetEntrypoints(): Promise<void> {
        return this.ensureAuthenticated();
    }

    // Groups
    ensureCanCreateGroup(): Promise<void> {
        return this.ensureAuthorized(() => this.matchesRole([RoleName.Root]));
    }
    ensureCanUpdateGroup(): Promise<void> {
        return this.ensureAuthorized(() => this.matchesRole([RoleName.Root]));
    }
    ensureCanDeleteGroup(): Promise<void> {
        return this.ensureAuthorized(() => this.matchesRole([RoleName.Root]));
    }
    ensureCanGetGroups(): Promise<void> {
        return this.ensureAuthenticated();
    }

    // Operation logs
    ensureCanGetOperationLogs(): Promise<void> {
        return this.ensureAuthenticated();
    }

    // Users
    ensureCanCreateUser(): Promise<void> {
        return this.ensureAuthorized(() => this.matchesRole([RoleName.Root]));
    }
    ensureCanUpdateUser(): Promise<void> {
        return this.ensureAuthorized(() => this.matchesRole([RoleName.Root]));
    }
    ensureCanDeleteUser(): Promise<void> {
        return this.ensureAuthorized(() => this.matchesRole([RoleName.Root]));
    }
    ensureCanGetUsers(): Promise<void> {
        return this.ensureAuthenticated();
    }

    private async ensureAuthenticated(): Promise<void> {
        if (
            !this.enforceAuth ||
            // If there is a user, this method was already called and made its
            // checks, no need to re-do them
            this.currentUser
        ) {
            return;
        }

        const idpUser = await this.authenticator.getIdpUser();
        if (!idpUser) {
            throw new AuthenticationRequiredError();
        }

        this.currentUser = await this.users.findOneWithRolesByIdpAndIdpId(
            idpUser.idp,
            idpUser.id
        );
        if (!this.currentUser) {
            throw new NoUserCorrespondingToIdpUserError(idpUser);
        }
    }
    private async ensureAuthorized(
        hasRequiredRoles: () => boolean
    ): Promise<void> {
        if (!this.enforceAuth) {
            return;
        }

        await this.ensureAuthenticated();

        if (hasRequiredRoles && !hasRequiredRoles()) {
            throw new MissingRoleError();
        }
    }
    private matchesRole(targetRole: RoleTuple): boolean {
        return oneOfRolesMatchesRole(this.currentUser!.roles, targetRole);
    }
}
