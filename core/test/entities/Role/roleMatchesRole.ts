import { expect } from "chai";

import { roleMatchesRole, RoleName } from "../../../src/entities/Role";

describe("Role entity function roleMatchesRole", () => {
    describe("matches an input role to a target role", () => {
        const testCases: [string, [RoleName, string?], boolean][] = [
            // RoleName.Root
            ["root", [RoleName.Root], true],

            // RoleName.AppManager
            ["app-manager:appName", [RoleName.AppManager, "appName"], true],
            [
                "app-manager:different-appName",
                [RoleName.AppManager, "appName"],
                false
            ],

            // RoleName.EntrypointManager
            [
                "entrypoint-manager:example.com/",
                [RoleName.EntrypointManager, "example.com/"],
                true
            ],
            [
                "entrypoint-manager:sub.example.com/",
                [RoleName.EntrypointManager, "example.com/"],
                false
            ],

            // RoleName.BundleManager
            [
                "bundle-manager:bundleName",
                [RoleName.BundleManager, "bundleName"],
                true
            ],
            [
                "bundle-manager:different-bundleName",
                [RoleName.BundleManager, "bundleName"],
                false
            ]
        ];
        testCases.forEach(([inputRole, targetRole, expectedResult]) => {
            const matchesOrNot = expectedResult ? "matches" : "doesn't match";
            it(`case: ${inputRole} ${matchesOrNot} ${targetRole}`, () => {
                expect(roleMatchesRole(inputRole, targetRole)).to.equal(
                    expectedResult
                );
            });
        });
    });
});
