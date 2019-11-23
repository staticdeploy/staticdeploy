import { expect } from "chai";

import matchesName from "../../../src/entities/Role/matchesName";

describe("Role entity util matchesName", () => {
    describe("matches a name to a nameMatcher", () => {
        const testCases: [string, string, boolean][] = [
            // No * cases
            // Matches
            ["name", "name", true],
            // Non matches
            ["name", "NAME", false],
            ["name", "differentName", false],
            ["name", "name-suffix", false],
            ["name", "prefix-name", false],
            ["name", "ame", false],

            // *name cases
            // Matches
            ["*name", "name", true],
            ["*name", "prefix-name", true],
            // Non matches
            ["*name", "NAME", false],
            ["*name", "differentName", false],
            ["*name", "name-suffix", false],
            ["*name", "ame", false],
            ["*name", "prefix-NAME", false],
            ["*name", "prefix-differentName", false],
            ["*name", "prefix-name-suffix", false],
            ["*name", "prefix-ame", false],

            // name* cases
            // Matches
            ["name*", "name", true],
            ["name*", "name-suffix", true],
            // Non matches
            ["name*", "NAME", false],
            ["name*", "differentName", false],
            ["name*", "prefix-name", false],
            ["name*", "ame", false],
            ["name*", "NAME-suffix", false],
            ["name*", "differentName-suffix", false],
            ["name*", "prefix-name-suffix", false],
            ["name*", "ame-suffix", false],

            // na*me cases
            // Matches
            ["na*me", "name", true],
            ["na*me", "na-wedge-me", true],
            // Non matches
            ["na*me", "NAME", false],
            ["na*me", "differentName", false],
            ["na*me", "prefix-name", false],
            ["na*me", "ame", false],
            ["na*me", "NA-wedge-ME", false],
            ["na*me", "differentNa-wedge-me", false],
            ["na*me", "prefix-na-wedge-me-suffix", false],
            ["na*me", "a-wedge-me", false],

            // *na*me* cases
            // Matches
            ["*na*me*", "name", true],
            ["*na*me*", "na-wedge-me", true],
            ["*na*me*", "prefix-name", true],
            ["*na*me*", "name-suffix", true],
            ["*na*me*", "prefix-na-wedge-me-suffix", true],
            // Non matches
            ["*na*me*", "NAME", false],
            ["*na*me*", "differentName", false],
            ["*na*me*", "a-wedge-me", false],
            ["*na*me*", "NA-wedge-ME", false],
            ["*na*me*", "differentNa-wedge-me", false],
            ["*na*me*", "a-wedge-me", false],

            // * cases (all matches)
            ["*", "name", true],
            ["*", "na-wedge-me", true],
            ["*", "prefix-name", true],
            ["*", "name-suffix", true],
            ["*", "prefix-na-wedge-me-suffix", true],
            ["*", "NAME", true],
            ["*", "differentName", true],
            ["*", "a-wedge-me", true],
            ["*", "NA-wedge-ME", true],
            ["*", "differentNa-wedge-me", true],
            ["*", "a-wedge-me", true]
        ];
        testCases.forEach(([nameMatcher, name, expectedResult]) => {
            const matchesOrNot = expectedResult ? "matches" : "doesn't match";
            it(`case: ${nameMatcher} ${matchesOrNot} ${name}`, () => {
                expect(matchesName(nameMatcher, name)).to.equal(expectedResult);
            });
        });
    });
});
