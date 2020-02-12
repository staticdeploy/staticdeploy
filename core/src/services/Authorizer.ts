import {
    AuthenticationRequiredError,
    MissingRoleError
} from "../common/functionalErrors";
import { oneOfRolesMatchesRole, RoleName, RoleTuple } from "../entities/Role";
import { IUserWithRoles } from "../entities/User";

export default class Authorizer {
    private user: IUserWithRoles | null = null;
    constructor(private enforceAuth: boolean) {}

    _setUser(user: IUserWithRoles | null): void {
        this.user = user;
    }

    // Health checks
    canSeeHealtCheckDetails(): boolean {
        try {
            this.ensureAuthenticated();
            return true;
        } catch {
            return false;
        }
    }

    // Apps
    ensureCanCreateApp(): void {
        this.ensureAuthorized(() => this.matchesRole([RoleName.Root]));
    }
    ensureCanUpdateApp(appName: string): void {
        this.ensureAuthorized(
            () =>
                this.matchesRole([RoleName.Root]) ||
                this.matchesRole([RoleName.AppManager, appName])
        );
    }
    ensureCanDeleteApp(appName: string): void {
        this.ensureAuthorized(
            () =>
                this.matchesRole([RoleName.Root]) ||
                this.matchesRole([RoleName.AppManager, appName])
        );
    }
    ensureCanGetApps(): void {
        this.ensureAuthenticated();
    }

    // Bundles
    ensureCanCreateBundle(bundleName: string): void {
        this.ensureAuthorized(
            () =>
                this.matchesRole([RoleName.Root]) ||
                this.matchesRole([RoleName.BundleManager, bundleName])
        );
    }
    ensureCanDeleteBundles(bundlesName: string): void {
        this.ensureAuthorized(
            () =>
                this.matchesRole([RoleName.Root]) ||
                this.matchesRole([RoleName.BundleManager, bundlesName])
        );
    }
    ensureCanGetBundles(): void {
        this.ensureAuthenticated();
    }

    // Entrypoints
    ensureCanCreateEntrypoint(
        entrypointUrlMatcher: string,
        entrypointAppName: string
    ): void {
        this.ensureAuthorized(
            () =>
                this.matchesRole([RoleName.Root]) ||
                (this.matchesRole([RoleName.AppManager, entrypointAppName]) &&
                    this.matchesRole([
                        RoleName.EntrypointManager,
                        entrypointUrlMatcher
                    ]))
        );
    }
    ensureCanUpdateEntrypoint(entrypointUrlMatcher: string): void {
        this.ensureAuthorized(
            () =>
                this.matchesRole([RoleName.Root]) ||
                this.matchesRole([
                    RoleName.EntrypointManager,
                    entrypointUrlMatcher
                ])
        );
    }
    ensureCanDeleteEntrypoint(entrypointUrlMatcher: string): void {
        this.ensureAuthorized(
            () =>
                this.matchesRole([RoleName.Root]) ||
                this.matchesRole([
                    RoleName.EntrypointManager,
                    entrypointUrlMatcher
                ])
        );
    }
    ensureCanGetEntrypoints(): void {
        this.ensureAuthenticated();
    }

    // External caches
    ensureCanCreateExternalCache(): void {
        this.ensureAuthorized(() => this.matchesRole([RoleName.Root]));
    }
    ensureCanUpdateExternalCache(): void {
        this.ensureAuthorized(() => this.matchesRole([RoleName.Root]));
    }
    ensureCanDeleteExternalCache(): void {
        this.ensureAuthorized(() => this.matchesRole([RoleName.Root]));
    }
    ensureCanPurgeExternalCache(): void {
        this.ensureAuthorized(() => this.matchesRole([RoleName.Root]));
    }
    ensureCanGetExternalCaches(): void {
        this.ensureAuthorized(() => this.matchesRole([RoleName.Root]));
    }

    // Groups
    ensureCanCreateGroup(): void {
        this.ensureAuthorized(() => this.matchesRole([RoleName.Root]));
    }
    ensureCanUpdateGroup(): void {
        this.ensureAuthorized(() => this.matchesRole([RoleName.Root]));
    }
    ensureCanDeleteGroup(): void {
        this.ensureAuthorized(() => this.matchesRole([RoleName.Root]));
    }
    ensureCanGetGroups(): void {
        this.ensureAuthenticated();
    }

    // Operation logs
    ensureCanGetOperationLogs(): void {
        this.ensureAuthenticated();
    }

    // Users
    ensureCanCreateUser(): void {
        this.ensureAuthorized(() => this.matchesRole([RoleName.Root]));
    }
    ensureCanUpdateUser(): void {
        this.ensureAuthorized(() => this.matchesRole([RoleName.Root]));
    }
    ensureCanDeleteUser(): void {
        this.ensureAuthorized(() => this.matchesRole([RoleName.Root]));
    }
    ensureCanGetUsers(): void {
        this.ensureAuthenticated();
    }

    private ensureAuthenticated(): void {
        if (this.enforceAuth && !this.user) {
            throw new AuthenticationRequiredError();
        }
    }
    private ensureAuthorized(hasRequiredRoles: () => boolean): void {
        if (this.enforceAuth) {
            this.ensureAuthenticated();
            if (hasRequiredRoles && !hasRequiredRoles()) {
                throw new MissingRoleError();
            }
        }
    }
    private matchesRole(targetRole: RoleTuple): boolean {
        return oneOfRolesMatchesRole(this.user!.roles, targetRole);
    }
}
