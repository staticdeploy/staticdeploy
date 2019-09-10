import { expect } from "chai";

import matchesUrlMatcher from "../../../src/entities/Role/matchesUrlMatcher";

describe("Role entity util matchesUrlMatcher", () => {
    describe("matches a urlMatcher to a urlMatcherMatcher", () => {
        const testCases: [string, string, boolean][] = [
            // No * cases
            // Matches
            ["example.com/", "example.com/", true],
            ["example.com/", "example.com/sub/", true],
            ["example.com/sub/", "example.com/sub/", true],
            ["example.com/sub/", "example.com/sub/sub/", true],
            // Non matches
            ["example.com/", "sub.example.com/", false],
            ["example.com/", "pre-example.com/", false],
            ["example.com/sub/", "example.com/other/", false],
            // Tricky cases
            ["example.com/", "xample.com/", false],
            ["example.com/", "sub.example.com/example.com/", false],
            ["example.com/", "pre-example.com/example.com/", false],

            // *. cases
            // Matches
            ["*.example.com/", "sub.example.com/", true],
            ["*.example.com/", "sub.sub.example.com/", true],
            ["*.example.com/", "sub.example.com/sub/", true],
            ["*.example.com/sub/", "sub.example.com/sub/", true],
            ["*.example.com/sub/", "sub.example.com/sub/sub/", true],
            // Non matches
            ["*.example.com/", "example.com/", false],
            ["*.example.com/", "pre-example.com/", false],
            ["*.example.com/sub/", "sub.example.com/other/", false],
            // Tricky cases
            ["*.example.com/", "xample.com/", false],
            ["*.example.com/", "example.com/sub.example.com/", false],
            ["*.example.com/", "pre-example.com/sub.example.com/", false],

            // * cases
            // Matches
            ["*example.com/", "example.com/", true],
            ["*example.com/", "example.com/sub/", true],
            ["*example.com/", "pre-example.com/", true],
            ["*example.com/", "pre-example.com/sub/", true],
            ["*example.com/", "sub.example.com/", true],
            ["*example.com/", "sub.example.com/sub/", true],
            ["*example.com/sub/", "sub.example.com/sub/", true],
            ["*example.com/sub/", "sub.example.com/sub/sub/", true],
            // Non matches
            ["*example.com/sub/", "example.com/other/", false],
            // Tricky cases
            ["*example.com/", "xample.com/", false],
            ["*.example.com/", "example.com/sub.example.com/", false]
        ];
        testCases.forEach(([urlMatcherMatcher, urlMatcher, expectedResult]) => {
            const matchesOrNot = expectedResult ? "matches" : "doesn't match";
            it(`case: ${urlMatcherMatcher} ${matchesOrNot} ${urlMatcher}`, () => {
                expect(
                    matchesUrlMatcher(urlMatcherMatcher, urlMatcher)
                ).to.equal(expectedResult);
            });
        });
    });
});
