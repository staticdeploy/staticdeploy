import { expect } from "chai";

import {
    AuthenticationRequiredError,
    MissingRoleError
} from "../../src/common/functionalErrors";
import Authorizer from "../../src/services/Authorizer";

function getAuthorizerForUser(user: any) {
    const authorizer = new Authorizer(true);
    authorizer._setUser(user);
    return authorizer;
}

describe("service Authorizer", () => {
    // General
    describe("ensure* methods", () => {
        it("don't throw anything when enforceAuth = false", () => {
            const authorizer = new Authorizer(false);
            authorizer.ensureCanCreateApp();
        });
        it("throw AuthenticationRequiredError when the request is not authenticated", () => {
            const authorizer = new Authorizer(true);
            const troublemaker = () => authorizer.ensureCanCreateApp();
            expect(troublemaker).to.throw(AuthenticationRequiredError);
        });
    });

    // Apps
    describe("ensureCanCreateApp", () => {
        it("throws MissingRoleError if the user is not allowed to create the app", () => {
            const authorizer = getAuthorizerForUser({ id: "id", roles: [] });
            const troublemaker = () => authorizer.ensureCanCreateApp();
            expect(troublemaker).to.throw(MissingRoleError);
        });
        it("doesn't throw if the user is allowed to create the app", () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["root"]
            });
            authorizer.ensureCanCreateApp();
        });
    });
    describe("ensureCanUpdateApp", () => {
        it("throws MissingRoleError if the user is not allowed to update the app", () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["app-manager:different-appName"]
            });
            const troublemaker = () => authorizer.ensureCanUpdateApp("appName");
            expect(troublemaker).to.throw(MissingRoleError);
        });
        it("doesn't throw if the user is allowed to update the app", () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["app-manager:appName"]
            });
            authorizer.ensureCanUpdateApp("appName");
        });
    });
    describe("ensureCanDeleteApp", () => {
        it("throws MissingRoleError if the user is not allowed to delete the app", () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["app-manager:different-appName"]
            });
            const troublemaker = () => authorizer.ensureCanDeleteApp("appName");
            expect(troublemaker).to.throw(MissingRoleError);
        });
        it("doesn't throw if the user is allowed to delete the app", () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["app-manager:appName"]
            });
            authorizer.ensureCanDeleteApp("appName");
        });
    });
    describe("ensureCanGetApps", () => {
        it("doesn't throw if the user is allowed to get apps", () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: []
            });
            authorizer.ensureCanGetApps();
        });
    });

    // Bundles
    describe("ensureCanCreateBundle", () => {
        it("throws MissingRoleError if the user is not allowed to create the bundle", () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["bundle-manager:different-bundleName"]
            });
            const troublemaker = () =>
                authorizer.ensureCanCreateBundle("bundleName");
            expect(troublemaker).to.throw(MissingRoleError);
        });
        it("doesn't throw if the user is allowed to create the bundle", () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["bundle-manager:bundleName"]
            });
            authorizer.ensureCanCreateBundle("bundleName");
        });
    });
    describe("ensureCanDeleteBundles", () => {
        it("throws MissingRoleError if the user is not allowed to delete the bundles", () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["bundle-manager:different-bundleName"]
            });
            const troublemaker = () =>
                authorizer.ensureCanDeleteBundles("bundleName");
            expect(troublemaker).to.throw(MissingRoleError);
        });
        it("doesn't throw if the user is allowed to delete the bundles", () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["bundle-manager:bundleName"]
            });
            authorizer.ensureCanDeleteBundles("bundleName");
        });
    });
    describe("ensureCanGetBundles", () => {
        it("doesn't throw if the user is allowed to get bundles", () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: []
            });
            authorizer.ensureCanGetBundles();
        });
    });

    // Entrypoints
    describe("ensureCanCreateEntrypoint", () => {
        describe("throws MissingRoleError if the user is not allowed to create the entrypoint", () => {
            it("case: missing entrypoint-manager role", () => {
                const authorizer = getAuthorizerForUser({
                    id: "id",
                    roles: ["app-manager:appName"]
                });
                const troublemaker = () =>
                    authorizer.ensureCanCreateEntrypoint(
                        "example.com/",
                        "appName"
                    );
                expect(troublemaker).to.throw(MissingRoleError);
            });
            it("case: missing app-manager role", () => {
                const authorizer = getAuthorizerForUser({
                    id: "id",
                    roles: ["entrypoint-manager:example.com/"]
                });
                const troublemaker = () =>
                    authorizer.ensureCanCreateEntrypoint(
                        "example.com/",
                        "appName"
                    );
                expect(troublemaker).to.throw(MissingRoleError);
            });
        });
        it("doesn't throw if the user is allowed to create the entrypoint", () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: [
                    "entrypoint-manager:example.com/",
                    "app-manager:appName"
                ]
            });
            authorizer.ensureCanCreateEntrypoint("example.com/", "appName");
        });
    });
    describe("ensureCanUpdateEntrypoint", () => {
        it("throws MissingRoleError if the user is not allowed to update the entrypoint", () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["entrypoint-manager:different-example.com/"]
            });
            const troublemaker = () =>
                authorizer.ensureCanUpdateEntrypoint("example.com/");
            expect(troublemaker).to.throw(MissingRoleError);
        });
        it("doesn't throw if the user is allowed to update the entrypoint", () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["entrypoint-manager:example.com/"]
            });
            authorizer.ensureCanUpdateEntrypoint("example.com/");
        });
    });
    describe("ensureCanDeleteEntrypoint", () => {
        it("throws MissingRoleError if the user is not allowed to delete the entrypoint", () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["entrypoint-manager:different-example.com/"]
            });
            const troublemaker = () =>
                authorizer.ensureCanDeleteEntrypoint("example.com/");
            expect(troublemaker).to.throw(MissingRoleError);
        });
        it("doesn't throw if the user is allowed to delete the entrypoint", () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["entrypoint-manager:example.com/"]
            });
            authorizer.ensureCanDeleteEntrypoint("example.com/");
        });
    });
    describe("ensureCanGetEntrypoints", () => {
        it("doesn't throw if the user is allowed to get entrypoints", () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: []
            });
            authorizer.ensureCanGetEntrypoints();
        });
    });

    // External caches
    describe("ensureCanCreateExternalCache", () => {
        it("throws MissingRoleError if the user is not allowed to create the external cache", () => {
            const authorizer = getAuthorizerForUser({ id: "id", roles: [] });
            const troublemaker = () =>
                authorizer.ensureCanCreateExternalCache();
            expect(troublemaker).to.throw(MissingRoleError);
        });
        it("doesn't throw if the user is allowed to create the external cache", () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["root"]
            });
            authorizer.ensureCanCreateExternalCache();
        });
    });
    describe("ensureCanUpdateExternalCache", () => {
        it("throws MissingRoleError if the user is not allowed to update the external cache", () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: []
            });
            const troublemaker = () =>
                authorizer.ensureCanUpdateExternalCache();
            expect(troublemaker).to.throw(MissingRoleError);
        });
        it("doesn't throw if the user is allowed to update the external cache", () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["root"]
            });
            authorizer.ensureCanUpdateExternalCache();
        });
    });
    describe("ensureCanDeleteExternalCache", () => {
        it("throws MissingRoleError if the user is not allowed to delete the external cache", () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: []
            });
            const troublemaker = () =>
                authorizer.ensureCanDeleteExternalCache();
            expect(troublemaker).to.throw(MissingRoleError);
        });
        it("doesn't throw if the user is allowed to delete the external cache", () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["root"]
            });
            authorizer.ensureCanDeleteExternalCache();
        });
    });
    describe("ensureCanGetExternalCaches", () => {
        it("throws MissingRoleError if the user is not allowed to get external caches", () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: []
            });
            const troublemaker = () => authorizer.ensureCanGetExternalCaches();
            expect(troublemaker).to.throw(MissingRoleError);
        });
        it("doesn't throw if the user is allowed to get external caches", () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["root"]
            });
            authorizer.ensureCanGetExternalCaches();
        });
    });

    // Groups
    describe("ensureCanCreateGroup", () => {
        it("throws MissingRoleError if the user is not allowed to create the group", () => {
            const authorizer = getAuthorizerForUser({ id: "id", roles: [] });
            const troublemaker = () => authorizer.ensureCanCreateGroup();
            expect(troublemaker).to.throw(MissingRoleError);
        });
        it("doesn't throw if the user is allowed to create the group", () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["root"]
            });
            authorizer.ensureCanCreateGroup();
        });
    });
    describe("ensureCanUpdateGroup", () => {
        it("throws MissingRoleError if the user is not allowed to update the group", () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: []
            });
            const troublemaker = () => authorizer.ensureCanUpdateGroup();
            expect(troublemaker).to.throw(MissingRoleError);
        });
        it("doesn't throw if the user is allowed to update the group", () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["root"]
            });
            authorizer.ensureCanUpdateGroup();
        });
    });
    describe("ensureCanDeleteGroup", () => {
        it("throws MissingRoleError if the user is not allowed to delete the group", () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: []
            });
            const troublemaker = () => authorizer.ensureCanDeleteGroup();
            expect(troublemaker).to.throw(MissingRoleError);
        });
        it("doesn't throw if the user is allowed to delete the group", () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["root"]
            });
            authorizer.ensureCanDeleteGroup();
        });
    });
    describe("ensureCanGetGroups", () => {
        it("doesn't throw if the user is allowed to get groups", () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: []
            });
            authorizer.ensureCanGetGroups();
        });
    });

    // Operation logs
    describe("ensureCanGetOperationLogs", () => {
        it("doesn't throw if the user is allowed to get operation logs", () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: []
            });
            authorizer.ensureCanGetOperationLogs();
        });
    });

    // Users
    describe("ensureCanCreateUser", () => {
        it("throws MissingRoleError if the user is not allowed to create the user", () => {
            const authorizer = getAuthorizerForUser({ id: "id", roles: [] });
            const troublemaker = () => authorizer.ensureCanCreateUser();
            expect(troublemaker).to.throw(MissingRoleError);
        });
        it("doesn't throw if the user is allowed to create the user", () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["root"]
            });
            authorizer.ensureCanCreateUser();
        });
    });
    describe("ensureCanUpdateUser", () => {
        it("throws MissingRoleError if the user is not allowed to update the user", () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: []
            });
            const troublemaker = () => authorizer.ensureCanUpdateUser();
            expect(troublemaker).to.throw(MissingRoleError);
        });
        it("doesn't throw if the user is allowed to update the user", () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["root"]
            });
            authorizer.ensureCanUpdateUser();
        });
    });
    describe("ensureCanDeleteUser", () => {
        it("throws MissingRoleError if the user is not allowed to delete the user", () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: []
            });
            const troublemaker = () => authorizer.ensureCanDeleteUser();
            expect(troublemaker).to.throw(MissingRoleError);
        });
        it("doesn't throw if the user is allowed to delete the user", () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: ["root"]
            });
            authorizer.ensureCanDeleteUser();
        });
    });
    describe("ensureCanGetUsers", () => {
        it("doesn't throw if the user is allowed to get users", () => {
            const authorizer = getAuthorizerForUser({
                id: "id",
                roles: []
            });
            authorizer.ensureCanGetUsers();
        });
    });
});
