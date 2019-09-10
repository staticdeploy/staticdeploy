import { expect } from "chai";

import { roleMatchesRole, RoleName } from "../../../src/entities/Role";

describe("Role entity function roleMatchesRole", () => {
    describe("matches an input role to a target role", () => {
        const testCases: [string, [RoleName, string?], boolean][] = [
            // RoleName.Root
            ["root", [RoleName.Root], true],

            // RoleName.AppManager
            ["app-manager:appId", [RoleName.AppManager, "appId"], true],
            [
                "app-manager:different-appId",
                [RoleName.AppManager, "appId"],
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
                "bundle-manager:bundleId",
                [RoleName.BundleManager, "bundleId"],
                true
            ],
            [
                "bundle-manager:different-bundleId",
                [RoleName.BundleManager, "bundleId"],
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
