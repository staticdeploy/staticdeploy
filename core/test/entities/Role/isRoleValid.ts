import { expect } from "chai";

import { isRoleValid } from "../../../src/entities/Role";

describe("Role entity util isRoleValid", () => {
    describe("it returns wether a role is valid or not", () => {
        const testCases: [string, boolean][] = [
            // Invalid cases
            ["root:example.com/", false],
            ["app-manager:appId:entrypointId", false],
            ["entrypoint-manager:https://example.com/", false],
            ["invalid-role", false],
            ["invalid-role:appId", false],
            // Valid cases
            ["root", true],
            ["app-manager:appId", true],
            ["entrypoint-manager:example.com/", true]
        ];
        testCases.forEach(([role, expectedResult]) => {
            const validOrNot = expectedResult ? "valid" : "not valid";
            it(`case: ${role} is ${validOrNot}`, () => {
                expect(isRoleValid(role)).to.equal(expectedResult);
            });
        });
    });
});
