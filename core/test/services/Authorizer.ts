import { expect } from "chai";
import sinon from "sinon";

import {
    AuthenticationRequiredError,
    MissingRoleError,
    UserNotFoundError
} from "../../src/common/errors";
import { AuthEnforcementLevel } from "../../src/dependencies/IUsecaseConfig";
import { IIdpUser } from "../../src/entities/User";
import Authenticator from "../../src/services/Authenticator";
import Authorizer from "../../src/services/Authorizer";
import { getMockDependencies } from "../testUtils";

function getMockAuthenticator(idpUser: IIdpUser | null): Authenticator {
    return {
        getIdpUser: sinon.stub().resolves(idpUser)
    } as any;
}

function getAuthorizerForUser(user: any) {
    const deps = getMockDependencies();
    deps.storages.users.findOneWithRolesByIdpAndIdpId.resolves(user);
    return new Authorizer(
        deps.storages.users,
        getMockAuthenticator({ id: "id", idp: "idp" }),
        AuthEnforcementLevel.Authorization
    );
}

describe("service Authorizer", () => {
    // General
    describe("ensure* methods", () => {
        it("don't throw anything if AuthEnforcementLevel = None (0)", async () => {
            const deps = getMockDependencies();
            const authorizer = new Authorizer(
                deps.storages.users,
                getMockAuthenticator(null),
                AuthEnforcementLevel.None
            );
            await authorizer.ensureCanCreateApp();
        });
        it("throw AuthenticationRequiredError if the request is not authenticated", async () => {
            const deps = getMockDependencies();
            const authorizer = new Authorizer(
                deps.storages.users,
                getMockAuthenticator(null),
                AuthEnforcementLevel.Authorization
            );
            const ensurePromise = authorizer.ensureCanCreateApp();
            await expect(ensurePromise).to.be.rejectedWith(
                AuthenticationRequiredError
            );
        });
        it("throw UserNotFoundError if no user corresponds to the request idp user", async () => {
            const deps = getMockDependencies();
            const authorizer = new Authorizer(
                deps.storages.users,
                getMockAuthenticator({ id: "id", idp: "idp" }),
                AuthEnforcementLevel.Authorization
            );
            const ensurePromise = authorizer.ensureCanCreateApp();
            await expect(ensurePromise).to.be.rejectedWith(UserNotFoundError);
        });
    });

    // Apps
    describe("ensureCanCreateApp", () => {
        it("throws MissingRoleError if the user is not allowed to create the app", async () => {
            const authorizer = getAuthorizerForUser({ id: "id", roles: [] });
            const ensurePromise = authorizer.ensureCanCreateApp();
            await expect(ensurePromise).to.be.rejectedWith(MissingRoleError);
        });
        it("doesn't throw if the user is allowed to create the app", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["root"]
            });
            await authorizer.ensureCanCreateApp();
        });
    });
    describe("ensureCanUpdateApp", () => {
        it("throws MissingRoleError if the user is not allowed to update the app", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["app-manager:different-appId"]
            });
            const ensurePromise = authorizer.ensureCanUpdateApp("appId");
            await expect(ensurePromise).to.be.rejectedWith(MissingRoleError);
        });
        it("doesn't throw if the user is allowed to update the app", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["app-manager:appId"]
            });
            await authorizer.ensureCanUpdateApp("appId");
        });
    });
    describe("ensureCanDeleteApp", () => {
        it("throws MissingRoleError if the user is not allowed to delete the app", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["app-manager:different-appId"]
            });
            const ensurePromise = authorizer.ensureCanDeleteApp("appId");
            await expect(ensurePromise).to.be.rejectedWith(MissingRoleError);
        });
        it("doesn't throw if the user is allowed to delete the app", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["app-manager:appId"]
            });
            await authorizer.ensureCanDeleteApp("appId");
        });
    });
    describe("ensureCanGetApps", () => {
        it("doesn't throw if the user is allowed to get apps", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: []
            });
            await authorizer.ensureCanGetApps();
        });
    });

    // Bundles
    describe("ensureCanCreateBundle", () => {
        it("throws MissingRoleError if the user is not allowed to create the bundle", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["bundle-manager:different-bundleName"]
            });
            const ensurePromise = authorizer.ensureCanCreateBundle(
                "bundleName"
            );
            await expect(ensurePromise).to.be.rejectedWith(MissingRoleError);
        });
        it("doesn't throw if the user is allowed to create the bundle", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["bundle-manager:bundleName"]
            });
            await authorizer.ensureCanCreateBundle("bundleName");
        });
    });
    describe("ensureCanDeleteBundles", () => {
        it("throws MissingRoleError if the user is not allowed to delete the bundles", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["bundle-manager:different-bundleName"]
            });
            const ensurePromise = authorizer.ensureCanDeleteBundles(
                "bundleName"
            );
            await expect(ensurePromise).to.be.rejectedWith(MissingRoleError);
        });
        it("doesn't throw if the user is allowed to delete the bundles", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["bundle-manager:bundleName"]
            });
            await authorizer.ensureCanDeleteBundles("bundleName");
        });
    });
    describe("ensureCanGetBundles", () => {
        it("doesn't throw if the user is allowed to get bundles", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: []
            });
            await authorizer.ensureCanGetBundles();
        });
    });

    // Entrypoints
    describe("ensureCanCreateEntrypoint", () => {
        it("throws MissingRoleError if the user is not allowed to create the entrypoint", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["app-manager:appId"]
            });
            const ensurePromise = authorizer.ensureCanCreateEntrypoint(
                "appId",
                "example.com/"
            );
            await expect(ensurePromise).to.be.rejectedWith(MissingRoleError);
        });
        it("doesn't throw if the user is allowed to create the entrypoint", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["entrypoint-creator:example.com/", "app-manager:appId"]
            });
            await authorizer.ensureCanCreateEntrypoint("appId", "example.com/");
        });
    });
    describe("ensureCanUpdateEntrypoint", () => {
        it("throws MissingRoleError if the user is not allowed to update the entrypoint", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: [
                    "app-manager:different-appId",
                    "entrypoint-manager:different-entrypointId"
                ]
            });
            const ensurePromise = authorizer.ensureCanUpdateEntrypoint(
                "entrypointId",
                "appId"
            );
            await expect(ensurePromise).to.be.rejectedWith(MissingRoleError);
        });
        describe("doesn't throw if the user is allowed to update the entrypoint", () => {
            it("case: has app-manager role", async () => {
                const authorizer = getAuthorizerForUser({
                    id: "id",
                    roles: ["app-manager:appId"]
                });
                await authorizer.ensureCanUpdateEntrypoint(
                    "entrypointId",
                    "appId"
                );
            });
            it("case: has entrypoint-manager role", async () => {
                const authorizer = getAuthorizerForUser({
                    id: "id",
                    roles: ["entrypoint-manager:entrypointId"]
                });
                await authorizer.ensureCanUpdateEntrypoint(
                    "entrypointId",
                    "appId"
                );
            });
        });
    });
    describe("ensureCanDeleteEntrypoint", () => {
        it("throws MissingRoleError if the user is not allowed to delete the entrypoint", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: [
                    "app-manager:different-appId",
                    "entrypoint-manager:different-entrypointId"
                ]
            });
            const ensurePromise = authorizer.ensureCanDeleteEntrypoint(
                "entrypointId",
                "appId"
            );
            await expect(ensurePromise).to.be.rejectedWith(MissingRoleError);
        });
        describe("doesn't throw if the user is allowed to delete the entrypoint", () => {
            it("case: has app-manager role", async () => {
                const authorizer = getAuthorizerForUser({
                    id: "id",
                    roles: ["app-manager:appId"]
                });
                await authorizer.ensureCanDeleteEntrypoint(
                    "entrypointId",
                    "appId"
                );
            });
            it("case: has entrypoint-manager role", async () => {
                const authorizer = getAuthorizerForUser({
                    id: "id",
                    roles: ["entrypoint-manager:entrypointId"]
                });
                await authorizer.ensureCanDeleteEntrypoint(
                    "entrypointId",
                    "appId"
                );
            });
        });
    });
    describe("ensureCanGetEntrypoints", () => {
        it("doesn't throw if the user is allowed to get entrypoints", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: []
            });
            await authorizer.ensureCanGetEntrypoints();
        });
    });

    // Groups
    describe("ensureCanCreateGroup", () => {
        it("throws MissingRoleError if the user is not allowed to create the group", async () => {
            const authorizer = getAuthorizerForUser({ id: "id", roles: [] });
            const ensurePromise = authorizer.ensureCanCreateGroup();
            await expect(ensurePromise).to.be.rejectedWith(MissingRoleError);
        });
        it("doesn't throw if the user is allowed to create the group", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["root"]
            });
            await authorizer.ensureCanCreateGroup();
        });
    });
    describe("ensureCanUpdateGroup", () => {
        it("throws MissingRoleError if the user is not allowed to update the group", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: []
            });
            const ensurePromise = authorizer.ensureCanUpdateGroup();
            await expect(ensurePromise).to.be.rejectedWith(MissingRoleError);
        });
        it("doesn't throw if the user is allowed to update the group", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["root"]
            });
            await authorizer.ensureCanUpdateGroup();
        });
    });
    describe("ensureCanDeleteGroup", () => {
        it("throws MissingRoleError if the user is not allowed to delete the group", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: []
            });
            const ensurePromise = authorizer.ensureCanDeleteGroup();
            await expect(ensurePromise).to.be.rejectedWith(MissingRoleError);
        });
        it("doesn't throw if the user is allowed to delete the group", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["root"]
            });
            await authorizer.ensureCanDeleteGroup();
        });
    });
    describe("ensureCanGetGroups", () => {
        it("doesn't throw if the user is allowed to get groups", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: []
            });
            await authorizer.ensureCanGetGroups();
        });
    });

    // Operation logs
    describe("ensureCanGetOperationLogs", () => {
        it("doesn't throw if the user is allowed to get operation logs", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: []
            });
            await authorizer.ensureCanGetOperationLogs();
        });
    });

    // Users
    describe("ensureCanCreateUser", () => {
        it("throws MissingRoleError if the user is not allowed to create the user", async () => {
            const authorizer = getAuthorizerForUser({ id: "id", roles: [] });
            const ensurePromise = authorizer.ensureCanCreateUser();
            await expect(ensurePromise).to.be.rejectedWith(MissingRoleError);
        });
        it("doesn't throw if the user is allowed to create the user", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["root"]
            });
            await authorizer.ensureCanCreateUser();
        });
    });
    describe("ensureCanUpdateUser", () => {
        it("throws MissingRoleError if the user is not allowed to update the user", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: []
            });
            const ensurePromise = authorizer.ensureCanUpdateUser();
            await expect(ensurePromise).to.be.rejectedWith(MissingRoleError);
        });
        it("doesn't throw if the user is allowed to update the user", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["root"]
            });
            await authorizer.ensureCanUpdateUser();
        });
    });
    describe("ensureCanDeleteUser", () => {
        it("throws MissingRoleError if the user is not allowed to delete the user", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: []
            });
            const ensurePromise = authorizer.ensureCanDeleteUser();
            await expect(ensurePromise).to.be.rejectedWith(MissingRoleError);
        });
        it("doesn't throw if the user is allowed to delete the user", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["root"]
            });
            await authorizer.ensureCanDeleteUser();
        });
    });
    describe("ensureCanGetUsers", () => {
        it("doesn't throw if the user is allowed to get users", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: []
            });
            await authorizer.ensureCanGetUsers();
        });
    });
});
