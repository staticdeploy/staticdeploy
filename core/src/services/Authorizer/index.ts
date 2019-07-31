import {
    AuthenticationRequiredError,
    MissingRoleError
} from "../../common/errors";
import {
    oneOfRolesMatchesRole,
    RoleName,
    RoleTuple
} from "../../entities/Role";
import { IUser } from "../../entities/User";
import skipOnAuthNotEnforced from "./skipOnAuthNotEnforced";

export default class Authorizer {
    constructor(
        private user: IUser | null,
        // @ts-ignore: property read by @skipOnAuthNotEnforced
        private enforceAuth: boolean
    ) {}

    isAuthenticated(): boolean {
        return !!this.user;
    }

    // Apps
    @skipOnAuthNotEnforced
    ensureCanCreateApp(): void {
        this.ensureAuthenticated();
        this.ensureAuthorized(this.matchesRole([RoleName.Root]));
    }
    @skipOnAuthNotEnforced
    ensureCanUpdateApp(appId: string): void {
        this.ensureAuthenticated();
        this.ensureAuthorized(
            this.matchesRole([RoleName.Root]) ||
                this.matchesRole([RoleName.AppManager, appId])
        );
    }
    @skipOnAuthNotEnforced
    ensureCanDeleteApp(appId: string): void {
        this.ensureAuthenticated();
        this.ensureAuthorized(
            this.matchesRole([RoleName.Root]) ||
                this.matchesRole([RoleName.AppManager, appId])
        );
    }
    @skipOnAuthNotEnforced
    ensureCanGetApps(): void {
        this.ensureAuthenticated();
    }

    // Bundles
    @skipOnAuthNotEnforced
    ensureCanCreateBundle(bundleName: string): void {
        this.ensureAuthenticated();
        this.ensureAuthorized(
            this.matchesRole([RoleName.Root]) ||
                this.matchesRole([RoleName.BundleManager, bundleName])
        );
    }
    @skipOnAuthNotEnforced
    ensureCanDeleteBundles(bundlesName: string): void {
        this.ensureAuthenticated();
        this.ensureAuthorized(
            this.matchesRole([RoleName.Root]) ||
                this.matchesRole([RoleName.BundleManager, bundlesName])
        );
    }
    @skipOnAuthNotEnforced
    ensureCanGetBundles(): void {
        this.ensureAuthenticated();
    }

    // Entrypoints
    @skipOnAuthNotEnforced
    ensureCanCreateEntrypoint(
        entrypointAppId: string,
        entrypointUrlMatcher: string
    ): void {
        this.ensureAuthenticated();
        this.ensureAuthorized(
            this.matchesRole([RoleName.Root]) ||
                (this.matchesRole([RoleName.AppManager, entrypointAppId]) &&
                    this.matchesRole([
                        RoleName.EntrypointCreator,
                        entrypointUrlMatcher
                    ]))
        );
    }
    @skipOnAuthNotEnforced
    ensureCanUpdateEntrypoint(
        entrypointId: string,
        entrypointAppId: string
    ): void {
        this.ensureAuthenticated();
        this.ensureAuthorized(
            this.matchesRole([RoleName.Root]) ||
                this.matchesRole([RoleName.AppManager, entrypointAppId]) ||
                this.matchesRole([RoleName.EntrypointManager, entrypointId])
        );
    }
    @skipOnAuthNotEnforced
    ensureCanDeleteEntrypoint(
        entrypointId: string,
        entrypointAppId: string
    ): void {
        this.ensureAuthenticated();
        this.ensureAuthorized(
            this.matchesRole([RoleName.Root]) ||
                this.matchesRole([RoleName.AppManager, entrypointAppId]) ||
                this.matchesRole([RoleName.EntrypointManager, entrypointId])
        );
    }
    @skipOnAuthNotEnforced
    ensureCanGetEntrypoints(): void {
        this.ensureAuthenticated();
    }

    // Operation logs
    @skipOnAuthNotEnforced
    ensureCanGetOperationLogs(): void {
        this.ensureAuthenticated();
    }

    private ensureAuthenticated(): void {
        if (!this.isAuthenticated()) {
            throw new AuthenticationRequiredError();
        }
    }
    private ensureAuthorized(isAuthorized: boolean): void {
        if (!isAuthorized) {
            throw new MissingRoleError();
        }
    }
    private matchesRole(targetRole: RoleTuple): boolean {
        return oneOfRolesMatchesRole(this.user!.roles, targetRole);
    }
}
