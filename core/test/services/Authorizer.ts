import { expect } from "chai";

import {
    AuthenticationRequiredError,
    MissingRoleError
} from "../../src/common/errors";
import { AuthEnforcementLevel } from "../../src/dependencies/IUsecaseConfig";
import Authorizer from "../../src/services/Authorizer";

describe("service Authorizer", () => {
    // Apps
    describe("ensureCanCreateApp", () => {
        it("throws AuthenticationRequiredError if the request is not authenticated", () => {
            const authorizer = new Authorizer(
                null,
                AuthEnforcementLevel.Authorization
            );
            expect(() => authorizer.ensureCanCreateApp()).to.throw(
                AuthenticationRequiredError
            );
        });
        it("throws MissingRoleError if the user is not allowed to create the app", () => {
            const authorizer = new Authorizer(
                { id: "id", roles: [] },
                AuthEnforcementLevel.Authorization
            );
            expect(() => authorizer.ensureCanCreateApp()).to.throw(
                MissingRoleError
            );
        });
        it("doesn't throw if the user is allowed to create the app", () => {
            const authorizer = new Authorizer(
                { id: "id", roles: ["root"] },
                AuthEnforcementLevel.Authorization
            );
            expect(() => authorizer.ensureCanCreateApp()).not.to.throw();
        });
    });
    describe("ensureCanUpdateApp", () => {
        it("throws AuthenticationRequiredError if the request is not authenticated", () => {
            const authorizer = new Authorizer(
                null,
                AuthEnforcementLevel.Authorization
            );
            expect(() => authorizer.ensureCanUpdateApp("appId")).to.throw(
                AuthenticationRequiredError
            );
        });
        it("throws MissingRoleError if the user is not allowed to update the app", () => {
            const authorizer = new Authorizer(
                { id: "userId", roles: ["app-manager:different-appId"] },
                AuthEnforcementLevel.Authorization
            );
            expect(() => authorizer.ensureCanUpdateApp("appId")).to.throw(
                MissingRoleError
            );
        });
        it("doesn't throw if the user is allowed to update the app", () => {
            const authorizer = new Authorizer(
                { id: "userId", roles: ["app-manager:appId"] },
                AuthEnforcementLevel.Authorization
            );
            expect(() => authorizer.ensureCanUpdateApp("appId")).not.to.throw();
        });
    });
    describe("ensureCanDeleteApp", () => {
        it("throws AuthenticationRequiredError if the request is not authenticated", () => {
            const authorizer = new Authorizer(
                null,
                AuthEnforcementLevel.Authorization
            );
            expect(() => authorizer.ensureCanDeleteApp("appId")).to.throw(
                AuthenticationRequiredError
            );
        });
        it("throws MissingRoleError if the user is not allowed to delete the app", () => {
            const authorizer = new Authorizer(
                { id: "userId", roles: ["app-manager:different-appId"] },
                AuthEnforcementLevel.Authorization
            );
            expect(() => authorizer.ensureCanDeleteApp("appId")).to.throw(
                MissingRoleError
            );
        });
        it("doesn't throw if the user is allowed to delete the app", () => {
            const authorizer = new Authorizer(
                { id: "userId", roles: ["app-manager:appId"] },
                AuthEnforcementLevel.Authorization
            );
            expect(() => authorizer.ensureCanDeleteApp("appId")).not.to.throw();
        });
    });
    describe("ensureCanGetApps", () => {
        it("throws AuthenticationRequiredError if the request is not authenticated", () => {
            const authorizer = new Authorizer(
                null,
                AuthEnforcementLevel.Authorization
            );
            expect(() => authorizer.ensureCanGetApps()).to.throw(
                AuthenticationRequiredError
            );
        });
        it("doesn't throw if the user is allowed to get apps", () => {
            const authorizer = new Authorizer(
                { id: "userId", roles: [] },
                AuthEnforcementLevel.Authorization
            );
            expect(() => authorizer.ensureCanGetApps()).not.to.throw();
        });
    });

    // Bundles
    describe("ensureCanCreateBundle", () => {
        it("throws AuthenticationRequiredError if the request is not authenticated", () => {
            const authorizer = new Authorizer(
                null,
                AuthEnforcementLevel.Authorization
            );
            expect(() =>
                authorizer.ensureCanCreateBundle("bundleName")
            ).to.throw(AuthenticationRequiredError);
        });
        it("throws MissingRoleError if the user is not allowed to create the bundle", () => {
            const authorizer = new Authorizer(
                {
                    id: "userId",
                    roles: ["bundle-manager:different-bundleName"]
                },
                AuthEnforcementLevel.Authorization
            );
            expect(() =>
                authorizer.ensureCanCreateBundle("bundleName")
            ).to.throw(MissingRoleError);
        });
        it("doesn't throw if the user is allowed to create the bundle", () => {
            const authorizer = new Authorizer(
                { id: "userId", roles: ["bundle-manager:bundleName"] },
                AuthEnforcementLevel.Authorization
            );
            expect(() =>
                authorizer.ensureCanCreateBundle("bundleName")
            ).not.to.throw();
        });
    });
    describe("ensureCanDeleteBundles", () => {
        it("throws AuthenticationRequiredError if the request is not authenticated", () => {
            const authorizer = new Authorizer(
                null,
                AuthEnforcementLevel.Authorization
            );
            expect(() =>
                authorizer.ensureCanDeleteBundles("bundleName")
            ).to.throw(AuthenticationRequiredError);
        });
        it("throws MissingRoleError if the user is not allowed to delete the bundles", () => {
            const authorizer = new Authorizer(
                {
                    id: "userId",
                    roles: ["bundle-manager:different-bundleName"]
                },
                AuthEnforcementLevel.Authorization
            );
            expect(() =>
                authorizer.ensureCanDeleteBundles("bundleName")
            ).to.throw(MissingRoleError);
        });
        it("doesn't throw if the user is allowed to delete the bundles", () => {
            const authorizer = new Authorizer(
                { id: "userId", roles: ["bundle-manager:bundleName"] },
                AuthEnforcementLevel.Authorization
            );
            expect(() =>
                authorizer.ensureCanDeleteBundles("bundleName")
            ).not.to.throw();
        });
    });
    describe("ensureCanGetBundles", () => {
        it("throws AuthenticationRequiredError if the request is not authenticated", () => {
            const authorizer = new Authorizer(
                null,
                AuthEnforcementLevel.Authorization
            );
            expect(() => authorizer.ensureCanGetBundles()).to.throw(
                AuthenticationRequiredError
            );
        });
        it("doesn't throw if the user is allowed to get bundles", () => {
            const authorizer = new Authorizer(
                { id: "userId", roles: [] },
                AuthEnforcementLevel.Authorization
            );
            expect(() => authorizer.ensureCanGetBundles()).not.to.throw();
        });
    });

    // Entrypoints
    describe("ensureCanCreateEntrypoint", () => {
        it("throws AuthenticationRequiredError if the request is not authenticated", () => {
            const authorizer = new Authorizer(
                null,
                AuthEnforcementLevel.Authorization
            );
            expect(() =>
                authorizer.ensureCanCreateEntrypoint("appId", "example.com/")
            ).to.throw(AuthenticationRequiredError);
        });
        it("throws MissingRoleError if the user is not allowed to create the entrypoint", () => {
            const authorizer = new Authorizer(
                { id: "userId", roles: ["app-manager:appId"] },
                AuthEnforcementLevel.Authorization
            );
            expect(() =>
                authorizer.ensureCanCreateEntrypoint("appId", "example.com/")
            ).to.throw(MissingRoleError);
        });
        it("doesn't throw if the user is allowed to create the entrypoint", () => {
            const authorizer = new Authorizer(
                {
                    id: "userId",
                    roles: [
                        "entrypoint-creator:example.com/",
                        "app-manager:appId"
                    ]
                },
                AuthEnforcementLevel.Authorization
            );
            expect(() =>
                authorizer.ensureCanCreateEntrypoint("appId", "example.com/")
            ).not.to.throw();
        });
    });
    describe("ensureCanUpdateEntrypoint", () => {
        it("throws AuthenticationRequiredError if the request is not authenticated", () => {
            const authorizer = new Authorizer(
                null,
                AuthEnforcementLevel.Authorization
            );
            expect(() =>
                authorizer.ensureCanUpdateEntrypoint("entrypointId", "appId")
            ).to.throw(AuthenticationRequiredError);
        });
        it("throws MissingRoleError if the user is not allowed to update the entrypoint", () => {
            const authorizer = new Authorizer(
                {
                    id: "userId",
                    roles: [
                        "app-manager:different-appId",
                        "entrypoint-manager:different-entrypointId"
                    ]
                },
                AuthEnforcementLevel.Authorization
            );
            expect(() =>
                authorizer.ensureCanUpdateEntrypoint("entrypointId", "appId")
            ).to.throw(MissingRoleError);
        });
        describe("doesn't throw if the user is allowed to update the entrypoint", () => {
            it("case: has app-manager role", () => {
                const authorizer = new Authorizer(
                    { id: "userId", roles: ["app-manager:appId"] },
                    AuthEnforcementLevel.Authorization
                );
                expect(() =>
                    authorizer.ensureCanUpdateEntrypoint(
                        "entrypointId",
                        "appId"
                    )
                ).not.to.throw();
            });
            it("case: has entrypoint-manager role", () => {
                const authorizer = new Authorizer(
                    {
                        id: "userId",
                        roles: ["entrypoint-manager:entrypointId"]
                    },
                    AuthEnforcementLevel.Authorization
                );
                expect(() =>
                    authorizer.ensureCanUpdateEntrypoint(
                        "entrypointId",
                        "appId"
                    )
                ).not.to.throw();
            });
        });
    });
    describe("ensureCanDeleteEntrypoint", () => {
        it("throws AuthenticationRequiredError if the request is not authenticated", () => {
            const authorizer = new Authorizer(
                null,
                AuthEnforcementLevel.Authorization
            );
            expect(() =>
                authorizer.ensureCanDeleteEntrypoint("entrypointId", "appId")
            ).to.throw(AuthenticationRequiredError);
        });
        it("throws MissingRoleError if the user is not allowed to delete the entrypoint", () => {
            const authorizer = new Authorizer(
                {
                    id: "userId",
                    roles: [
                        "app-manager:different-appId",
                        "entrypoint-manager:different-entrypointId"
                    ]
                },
                AuthEnforcementLevel.Authorization
            );
            expect(() =>
                authorizer.ensureCanDeleteEntrypoint("entrypointId", "appId")
            ).to.throw(MissingRoleError);
        });
        describe("doesn't throw if the user is allowed to delete the entrypoint", () => {
            it("case: has app-manager role", () => {
                const authorizer = new Authorizer(
                    { id: "userId", roles: ["app-manager:appId"] },
                    AuthEnforcementLevel.Authorization
                );
                expect(() =>
                    authorizer.ensureCanDeleteEntrypoint(
                        "entrypointId",
                        "appId"
                    )
                ).not.to.throw();
            });
            it("case: has entrypoint-manager role", () => {
                const authorizer = new Authorizer(
                    {
                        id: "userId",
                        roles: ["entrypoint-manager:entrypointId"]
                    },
                    AuthEnforcementLevel.Authorization
                );
                expect(() =>
                    authorizer.ensureCanDeleteEntrypoint(
                        "entrypointId",
                        "appId"
                    )
                ).not.to.throw();
            });
        });
    });
    describe("ensureCanGetEntrypoints", () => {
        it("throws AuthenticationRequiredError if the request is not authenticated", () => {
            const authorizer = new Authorizer(
                null,
                AuthEnforcementLevel.Authorization
            );
            expect(() => authorizer.ensureCanGetEntrypoints()).to.throw(
                AuthenticationRequiredError
            );
        });
        it("doesn't throw if the user is allowed to get entrypoints", () => {
            const authorizer = new Authorizer(
                { id: "userId", roles: [] },
                AuthEnforcementLevel.Authorization
            );
            expect(() => authorizer.ensureCanGetEntrypoints()).not.to.throw();
        });
    });

    // Operation logs
    describe("ensureCanGetOperationLogs", () => {
        it("throws AuthenticationRequiredError if the request is not authenticated", () => {
            const authorizer = new Authorizer(
                null,
                AuthEnforcementLevel.Authorization
            );
            expect(() => authorizer.ensureCanGetOperationLogs()).to.throw(
                AuthenticationRequiredError
            );
        });
        it("doesn't throw if the user is allowed to get operation logs", () => {
            const authorizer = new Authorizer(
                { id: "userId", roles: [] },
                AuthEnforcementLevel.Authorization
            );
            expect(() => authorizer.ensureCanGetOperationLogs()).not.to.throw();
        });
    });
});
