import { expect } from "chai";
import { repeat } from "lodash";

import {
    isBundleNameOrTagValid,
    isBundleNameTagCombinationValid,
} from "../../src/entities/Bundle";

describe("Bundle entity validator isBundleNameOrTagValid", () => {
    describe("returns true when the passed-in name or tag is valid", () => {
        [
            "letters",
            "letters_and_underscores",
            "letters-and-dashes",
            "letters.and.dots",
            "letters/and/slashes",
            "letters0and0numbers",
            "0123456789",
            "combination0_./-",
            // Possible names of git branches and tags
            "master",
            "feature/some-feature",
            "v1.0.0",
            "1.0.0-beta1",
        ].forEach((nameOrTag) => {
            it(`case: ${nameOrTag}`, () => {
                expect(isBundleNameOrTagValid(nameOrTag)).to.equal(true);
            });
        });
    });

    describe("returns false when the passed-in name or tag is not valid", () => {
        [
            "",
            "with-colon:",
            "with-unsupported-chars*",
            "with-spaces ",
            "with-backslashes\\",
            repeat("too-long-", 50),
        ].forEach((nameOrTag) => {
            it(`case: ${nameOrTag}`, () => {
                expect(isBundleNameOrTagValid(nameOrTag)).to.equal(false);
            });
        });
    });
});

describe("Bundle entity validator isBundleNameTagCombinationValid", () => {
    describe("returns true when the passed-in name:tag combination is valid", () => {
        [
            "name:tag",
            "name_name:tag/tag",
            "name/name:v1.0.0",
            "name.name/name:tag_.tag",
        ].forEach((nameTagCombination) => {
            it(`case: ${nameTagCombination}`, () => {
                expect(
                    isBundleNameTagCombinationValid(nameTagCombination)
                ).to.equal(true);
            });
        });
    });

    describe("returns false when the passed-in name:tag combination is not valid", () => {
        [
            "no-colon",
            "no-tag:",
            ":no-name",
            "invalid-name*:tag",
            "invalid-tag:taag*",
        ].forEach((nameTagCombination) => {
            it(`case: ${nameTagCombination}`, () => {
                expect(
                    isBundleNameTagCombinationValid(nameTagCombination)
                ).to.equal(false);
            });
        });
    });
});
