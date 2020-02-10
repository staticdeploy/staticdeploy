import { expect } from "chai";
import sinon from "sinon";

import {
    AuthenticationRequiredError,
    MissingRoleError,
    NoUserCorrespondingToIdpUserError
} from "../../src/common/errors";
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
        true
    );
}

describe("service Authorizer", () => {
    // General
    describe("ensure* methods", () => {
        it("don't throw anything when enforceAuth = false", async () => {
            const deps = getMockDependencies();
            const authorizer = new Authorizer(
                deps.storages.users,
                getMockAuthenticator(null),
                false
            );
            await authorizer.ensureCanCreateApp();
        });
        it("throw AuthenticationRequiredError when the request is not authenticated", async () => {
            const deps = getMockDependencies();
            const authorizer = new Authorizer(
                deps.storages.users,
                getMockAuthenticator(null),
                true
            );
            const ensurePromise = authorizer.ensureCanCreateApp();
            await expect(ensurePromise).to.be.rejectedWith(
                AuthenticationRequiredError
            );
        });
        it("throw UserNotFoundError when no user corresponds to the request idp user", async () => {
            const deps = getMockDependencies();
            const authorizer = new Authorizer(
                deps.storages.users,
                getMockAuthenticator({ id: "id", idp: "idp" }),
                true
            );
            const ensurePromise = authorizer.ensureCanCreateApp();
            await expect(ensurePromise).to.be.rejectedWith(
                NoUserCorrespondingToIdpUserError
            );
        });
    });

    // Misc
    describe("getCurrentUser", () => {
        it("returns null when enforceAuth = false", async () => {
            const deps = getMockDependencies();
            const authorizer = new Authorizer(
                deps.storages.users,
                getMockAuthenticator(null),
                false
            );
            const currentUser = await authorizer.getCurrentUser();
            expect(currentUser).to.equal(null);
        });
        it("throws AuthenticationRequiredError when the request is not authenticated", async () => {
            const deps = getMockDependencies();
            const authorizer = new Authorizer(
                deps.storages.users,
                getMockAuthenticator(null),
                true
            );
            const getCurrentUserPromise = authorizer.getCurrentUser();
            await expect(getCurrentUserPromise).to.be.rejectedWith(
                AuthenticationRequiredError
            );
        });
        it("throws UserNotFoundError when no user corresponds to the request idp user", async () => {
            const deps = getMockDependencies();
            const authorizer = new Authorizer(
                deps.storages.users,
                getMockAuthenticator({ id: "id", idp: "idp" }),
                true
            );
            const getCurrentUserPromise = authorizer.getCurrentUser();
            await expect(getCurrentUserPromise).to.be.rejectedWith(
                NoUserCorrespondingToIdpUserError
            );
        });
        it("returns the request user", async () => {
            const user = { id: "id", roles: [] };
            const authorizer = getAuthorizerForUser(user);
            const currentUser = await authorizer.getCurrentUser();
            expect(currentUser).to.deep.equal(user);
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
                roles: ["app-manager:different-appName"]
            });
            const ensurePromise = authorizer.ensureCanUpdateApp("appName");
            await expect(ensurePromise).to.be.rejectedWith(MissingRoleError);
        });
        it("doesn't throw if the user is allowed to update the app", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["app-manager:appName"]
            });
            await authorizer.ensureCanUpdateApp("appName");
        });
    });
    describe("ensureCanDeleteApp", () => {
        it("throws MissingRoleError if the user is not allowed to delete the app", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["app-manager:different-appName"]
            });
            const ensurePromise = authorizer.ensureCanDeleteApp("appName");
            await expect(ensurePromise).to.be.rejectedWith(MissingRoleError);
        });
        it("doesn't throw if the user is allowed to delete the app", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["app-manager:appName"]
            });
            await authorizer.ensureCanDeleteApp("appName");
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
        describe("throws MissingRoleError if the user is not allowed to create the entrypoint", () => {
            it("case: missing entrypoint-manager role", async () => {
                const authorizer = getAuthorizerForUser({
                    id: "id",
                    roles: ["app-manager:appName"]
                });
                const ensurePromise = authorizer.ensureCanCreateEntrypoint(
                    "example.com/",
                    "appName"
                );
                await expect(ensurePromise).to.be.rejectedWith(
                    MissingRoleError
                );
            });
            it("case: missing app-manager role", async () => {
                const authorizer = getAuthorizerForUser({
                    id: "id",
                    roles: ["entrypoint-manager:example.com/"]
                });
                const ensurePromise = authorizer.ensureCanCreateEntrypoint(
                    "example.com/",
                    "appName"
                );
                await expect(ensurePromise).to.be.rejectedWith(
                    MissingRoleError
                );
            });
        });
        it("doesn't throw if the user is allowed to create the entrypoint", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: [
                    "entrypoint-manager:example.com/",
                    "app-manager:appName"
                ]
            });
            await authorizer.ensureCanCreateEntrypoint(
                "example.com/",
                "appName"
            );
        });
    });
    describe("ensureCanUpdateEntrypoint", () => {
        it("throws MissingRoleError if the user is not allowed to update the entrypoint", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["entrypoint-manager:different-example.com/"]
            });
            const ensurePromise = authorizer.ensureCanUpdateEntrypoint(
                "example.com/"
            );
            await expect(ensurePromise).to.be.rejectedWith(MissingRoleError);
        });
        it("doesn't throw if the user is allowed to update the entrypoint", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["entrypoint-manager:example.com/"]
            });
            await authorizer.ensureCanUpdateEntrypoint("example.com/");
        });
    });
    describe("ensureCanDeleteEntrypoint", () => {
        it("throws MissingRoleError if the user is not allowed to delete the entrypoint", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["entrypoint-manager:different-example.com/"]
            });
            const ensurePromise = authorizer.ensureCanDeleteEntrypoint(
                "example.com/"
            );
            await expect(ensurePromise).to.be.rejectedWith(MissingRoleError);
        });
        it("doesn't throw if the user is allowed to delete the entrypoint", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["entrypoint-manager:example.com/"]
            });
            await authorizer.ensureCanDeleteEntrypoint("example.com/");
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

    // External caches
    describe("ensureCanCreateExternalCache", () => {
        it("throws MissingRoleError if the user is not allowed to create the external cache", async () => {
            const authorizer = getAuthorizerForUser({ id: "id", roles: [] });
            const ensurePromise = authorizer.ensureCanCreateExternalCache();
            await expect(ensurePromise).to.be.rejectedWith(MissingRoleError);
        });
        it("doesn't throw if the user is allowed to create the external cache", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["root"]
            });
            await authorizer.ensureCanCreateExternalCache();
        });
    });
    describe("ensureCanUpdateExternalCache", () => {
        it("throws MissingRoleError if the user is not allowed to update the external cache", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: []
            });
            const ensurePromise = authorizer.ensureCanUpdateExternalCache();
            await expect(ensurePromise).to.be.rejectedWith(MissingRoleError);
        });
        it("doesn't throw if the user is allowed to update the external cache", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["root"]
            });
            await authorizer.ensureCanUpdateExternalCache();
        });
    });
    describe("ensureCanDeleteExternalCache", () => {
        it("throws MissingRoleError if the user is not allowed to delete the external cache", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: []
            });
            const ensurePromise = authorizer.ensureCanDeleteExternalCache();
            await expect(ensurePromise).to.be.rejectedWith(MissingRoleError);
        });
        it("doesn't throw if the user is allowed to delete the external cache", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["root"]
            });
            await authorizer.ensureCanDeleteExternalCache();
        });
    });
    describe("ensureCanGetExternalCaches", () => {
        it("throws MissingRoleError if the user is not allowed to get external caches", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: []
            });
            const ensurePromise = authorizer.ensureCanGetExternalCaches();
            await expect(ensurePromise).to.be.rejectedWith(MissingRoleError);
        });
        it("doesn't throw if the user is allowed to get external caches", async () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["root"]
            });
            await authorizer.ensureCanGetExternalCaches();
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
