import {
    AuthenticationRequiredError,
    MissingRoleError,
    UserNotFoundError
} from "../common/errors";
import { AuthEnforcementLevel } from "../dependencies/IUsecaseConfig";
import IUsersStorage from "../dependencies/IUsersStorage";
import { oneOfRolesMatchesRole, RoleName, RoleTuple } from "../entities/Role";
import { IUser, IUserWithRoles } from "../entities/User";
import Authenticator from "./Authenticator";

export default class Authorizer {
    private user: IUserWithRoles | null = null;

    constructor(
        private users: IUsersStorage,
        private authenticator: Authenticator,
        private authEnforcementLevel: AuthEnforcementLevel
    ) {}

    // Health
    async canSeeHealtCheckDetails(): Promise<boolean> {
        try {
            await this.enforceAuth(() => this.matchesRole([RoleName.Reader]));
            return true;
        } catch {
            return false;
        }
    }

    // Apps
    ensureCanCreateApp(): Promise<void> {
        return this.enforceAuth(() => this.matchesRole([RoleName.Root]));
    }
    ensureCanUpdateApp(appId: string): Promise<void> {
        return this.enforceAuth(
            () =>
                this.matchesRole([RoleName.Root]) ||
                this.matchesRole([RoleName.AppManager, appId])
        );
    }
    ensureCanDeleteApp(appId: string): Promise<void> {
        return this.enforceAuth(
            () =>
                this.matchesRole([RoleName.Root]) ||
                this.matchesRole([RoleName.AppManager, appId])
        );
    }
    ensureCanGetApps(): Promise<void> {
        return this.enforceAuth(() => this.matchesRole([RoleName.Reader]));
    }

    // Bundles
    ensureCanCreateBundle(bundleName: string): Promise<void> {
        return this.enforceAuth(
            () =>
                this.matchesRole([RoleName.Root]) ||
                this.matchesRole([RoleName.BundleManager, bundleName])
        );
    }
    ensureCanDeleteBundles(bundlesName: string): Promise<void> {
        return this.enforceAuth(
            () =>
                this.matchesRole([RoleName.Root]) ||
                this.matchesRole([RoleName.BundleManager, bundlesName])
        );
    }
    ensureCanGetBundles(): Promise<void> {
        return this.enforceAuth(() => this.matchesRole([RoleName.Reader]));
    }

    // Entrypoints
    ensureCanCreateEntrypoint(
        entrypointUrlMatcher: string,
        entrypointAppId: string
    ): Promise<void> {
        return this.enforceAuth(
            () =>
                this.matchesRole([RoleName.Root]) ||
                (this.matchesRole([RoleName.AppManager, entrypointAppId]) &&
                    this.matchesRole([
                        RoleName.EntrypointManager,
                        entrypointUrlMatcher
                    ]))
        );
    }
    ensureCanUpdateEntrypoint(entrypointUrlMatcher: string): Promise<void> {
        return this.enforceAuth(
            () =>
                this.matchesRole([RoleName.Root]) ||
                this.matchesRole([
                    RoleName.EntrypointManager,
                    entrypointUrlMatcher
                ])
        );
    }
    ensureCanDeleteEntrypoint(entrypointUrlMatcher: string): Promise<void> {
        return this.enforceAuth(
            () =>
                this.matchesRole([RoleName.Root]) ||
                this.matchesRole([
                    RoleName.EntrypointManager,
                    entrypointUrlMatcher
                ])
        );
    }
    ensureCanGetEntrypoints(): Promise<void> {
        return this.enforceAuth(() => this.matchesRole([RoleName.Reader]));
    }

    // Groups
    ensureCanCreateGroup(): Promise<void> {
        return this.enforceAuth(() => this.matchesRole([RoleName.Root]));
    }
    ensureCanUpdateGroup(): Promise<void> {
        return this.enforceAuth(() => this.matchesRole([RoleName.Root]));
    }
    ensureCanDeleteGroup(): Promise<void> {
        return this.enforceAuth(() => this.matchesRole([RoleName.Root]));
    }
    ensureCanGetGroups(): Promise<void> {
        return this.enforceAuth(() => this.matchesRole([RoleName.Reader]));
    }

    // Operation logs
    ensureCanGetOperationLogs(): Promise<void> {
        return this.enforceAuth(() => this.matchesRole([RoleName.Reader]));
    }
    getUser(): IUser | null {
        return this.user;
    }

    // Users
    ensureCanCreateUser(): Promise<void> {
        return this.enforceAuth(() => this.matchesRole([RoleName.Root]));
    }
    ensureCanUpdateUser(): Promise<void> {
        return this.enforceAuth(() => this.matchesRole([RoleName.Root]));
    }
    ensureCanDeleteUser(): Promise<void> {
        return this.enforceAuth(() => this.matchesRole([RoleName.Root]));
    }
    ensureCanGetUsers(): Promise<void> {
        return this.enforceAuth(() => this.matchesRole([RoleName.Reader]));
    }

    private async enforceAuth(hasRequiredRoles?: () => boolean): Promise<void> {
        if (this.authEnforcementLevel === AuthEnforcementLevel.None) {
            return;
        }

        const idpUser = await this.authenticator.getIdpUser();
        if (!idpUser) {
            throw new AuthenticationRequiredError();
        }

        this.user = await this.users.findOneWithRolesByIdpAndIdpId(
            idpUser.idp,
            idpUser.id
        );
        if (!this.user) {
            throw new UserNotFoundError(idpUser);
        }

        if (hasRequiredRoles && !hasRequiredRoles()) {
            throw new MissingRoleError();
        }
    }
    private matchesRole(targetRole: RoleTuple): boolean {
        return oneOfRolesMatchesRole(this.user!.roles, targetRole);
    }
}
