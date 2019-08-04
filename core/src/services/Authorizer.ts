import {
    AuthenticationRequiredError,
    MissingRoleError
} from "../common/errors";
import { AuthEnforcementLevel } from "../dependencies/IUsecaseConfig";
import { oneOfRolesMatchesRole, RoleName, RoleTuple } from "../entities/Role";
import { IUser } from "../entities/User";

export default class Authorizer {
    constructor(
        private user: IUser | null,
        private authEnforcementLevel: AuthEnforcementLevel
    ) {}

    isAuthenticated(): boolean {
        return !!this.user;
    }

    // Apps
    ensureCanCreateApp(): void {
        this.enforceAuth(() => this.matchesRole([RoleName.Root]));
    }
    ensureCanUpdateApp(appId: string): void {
        this.enforceAuth(
            () =>
                this.matchesRole([RoleName.Root]) ||
                this.matchesRole([RoleName.AppManager, appId])
        );
    }
    ensureCanDeleteApp(appId: string): void {
        this.enforceAuth(
            () =>
                this.matchesRole([RoleName.Root]) ||
                this.matchesRole([RoleName.AppManager, appId])
        );
    }
    ensureCanGetApps(): void {
        this.enforceAuth();
    }

    // Bundles
    ensureCanCreateBundle(bundleName: string): void {
        this.enforceAuth(
            () =>
                this.matchesRole([RoleName.Root]) ||
                this.matchesRole([RoleName.BundleManager, bundleName])
        );
    }
    ensureCanDeleteBundles(bundlesName: string): void {
        this.enforceAuth(
            () =>
                this.matchesRole([RoleName.Root]) ||
                this.matchesRole([RoleName.BundleManager, bundlesName])
        );
    }
    ensureCanGetBundles(): void {
        this.enforceAuth();
    }

    // Entrypoints
    ensureCanCreateEntrypoint(
        entrypointAppId: string,
        entrypointUrlMatcher: string
    ): void {
        this.enforceAuth(
            () =>
                this.matchesRole([RoleName.Root]) ||
                (this.matchesRole([RoleName.AppManager, entrypointAppId]) &&
                    this.matchesRole([
                        RoleName.EntrypointCreator,
                        entrypointUrlMatcher
                    ]))
        );
    }
    ensureCanUpdateEntrypoint(
        entrypointId: string,
        entrypointAppId: string
    ): void {
        this.enforceAuth(
            () =>
                this.matchesRole([RoleName.Root]) ||
                this.matchesRole([RoleName.AppManager, entrypointAppId]) ||
                this.matchesRole([RoleName.EntrypointManager, entrypointId])
        );
    }
    ensureCanDeleteEntrypoint(
        entrypointId: string,
        entrypointAppId: string
    ): void {
        this.enforceAuth(
            () =>
                this.matchesRole([RoleName.Root]) ||
                this.matchesRole([RoleName.AppManager, entrypointAppId]) ||
                this.matchesRole([RoleName.EntrypointManager, entrypointId])
        );
    }
    ensureCanGetEntrypoints(): void {
        this.enforceAuth();
    }

    // Operation logs
    ensureCanGetOperationLogs(): void {
        this.enforceAuth();
    }

    private enforceAuth(authorizer?: () => boolean): void {
        if (
            this.authEnforcementLevel >= AuthEnforcementLevel.Authentication &&
            !this.isAuthenticated()
        ) {
            throw new AuthenticationRequiredError();
        }
        if (
            this.authEnforcementLevel >= AuthEnforcementLevel.Authorization &&
            authorizer &&
            !authorizer()
        ) {
            throw new MissingRoleError();
        }
    }
    private matchesRole(targetRole: RoleTuple): boolean {
        return oneOfRolesMatchesRole(this.user!.roles, targetRole);
    }
}
