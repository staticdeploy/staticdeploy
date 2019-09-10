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
    private user: IUserWithRoles | null = null;

    constructor(
        private users: IUsersStorage,
        private authenticator: Authenticator,
        private enforceAuth: boolean
    ) {}

    // Misc
    async canSeeHealtCheckDetails(): Promise<boolean> {
        try {
            await this.ensure();
            return true;
        } catch {
            return false;
        }
    }
    getUser(): IUser | null {
        return this.user;
    }

    // Apps
    ensureCanCreateApp(): Promise<void> {
        return this.ensure(() => this.matchesRole([RoleName.Root]));
    }
    ensureCanUpdateApp(appId: string): Promise<void> {
        return this.ensure(
            () =>
                this.matchesRole([RoleName.Root]) ||
                this.matchesRole([RoleName.AppManager, appId])
        );
    }
    ensureCanDeleteApp(appId: string): Promise<void> {
        return this.ensure(
            () =>
                this.matchesRole([RoleName.Root]) ||
                this.matchesRole([RoleName.AppManager, appId])
        );
    }
    ensureCanGetApps(): Promise<void> {
        return this.ensure();
    }

    // Bundles
    ensureCanCreateBundle(bundleName: string): Promise<void> {
        return this.ensure(
            () =>
                this.matchesRole([RoleName.Root]) ||
                this.matchesRole([RoleName.BundleManager, bundleName])
        );
    }
    ensureCanDeleteBundles(bundlesName: string): Promise<void> {
        return this.ensure(
            () =>
                this.matchesRole([RoleName.Root]) ||
                this.matchesRole([RoleName.BundleManager, bundlesName])
        );
    }
    ensureCanGetBundles(): Promise<void> {
        return this.ensure();
    }

    // Entrypoints
    ensureCanCreateEntrypoint(
        entrypointUrlMatcher: string,
        entrypointAppId: string
    ): Promise<void> {
        return this.ensure(
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
        return this.ensure(
            () =>
                this.matchesRole([RoleName.Root]) ||
                this.matchesRole([
                    RoleName.EntrypointManager,
                    entrypointUrlMatcher
                ])
        );
    }
    ensureCanDeleteEntrypoint(entrypointUrlMatcher: string): Promise<void> {
        return this.ensure(
            () =>
                this.matchesRole([RoleName.Root]) ||
                this.matchesRole([
                    RoleName.EntrypointManager,
                    entrypointUrlMatcher
                ])
        );
    }
    ensureCanGetEntrypoints(): Promise<void> {
        return this.ensure();
    }

    // Groups
    ensureCanCreateGroup(): Promise<void> {
        return this.ensure(() => this.matchesRole([RoleName.Root]));
    }
    ensureCanUpdateGroup(): Promise<void> {
        return this.ensure(() => this.matchesRole([RoleName.Root]));
    }
    ensureCanDeleteGroup(): Promise<void> {
        return this.ensure(() => this.matchesRole([RoleName.Root]));
    }
    ensureCanGetGroups(): Promise<void> {
        return this.ensure();
    }

    // Operation logs
    ensureCanGetOperationLogs(): Promise<void> {
        return this.ensure();
    }

    // Users
    ensureCanCreateUser(): Promise<void> {
        return this.ensure(() => this.matchesRole([RoleName.Root]));
    }
    ensureCanUpdateUser(): Promise<void> {
        return this.ensure(() => this.matchesRole([RoleName.Root]));
    }
    ensureCanDeleteUser(): Promise<void> {
        return this.ensure(() => this.matchesRole([RoleName.Root]));
    }
    ensureCanGetUsers(): Promise<void> {
        return this.ensure();
    }

    private async ensure(hasRequiredRoles?: () => boolean): Promise<void> {
        if (!this.enforceAuth) {
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
            throw new NoUserCorrespondingToIdpUserError(idpUser);
        }

        if (hasRequiredRoles && !hasRequiredRoles()) {
            throw new MissingRoleError();
        }
    }
    private matchesRole(targetRole: RoleTuple): boolean {
        return oneOfRolesMatchesRole(this.user!.roles, targetRole);
    }
}
