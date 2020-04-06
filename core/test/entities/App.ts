import { expect } from "chai";
import { repeat } from "lodash";

import { isAppNameValid } from "../../src/entities/App";

describe("App entity validator isAppNameValid", () => {
    describe("returns true when the passed-in name is valid", () => {
        [
            "name",
            "name_with_underscores",
            "name-with-dashes",
            "name.with.dots",
            "name/with/slashes",
            "name-with-numbers-1234567890",
            "name-with-UPPERCASE-chars",
        ].forEach((name) => {
            it(`case: ${name}`, () => {
                expect(isAppNameValid(name)).to.equal(true);
            });
        });
    });

    describe("returns false when the passed-in name is not valid", () => {
        [
            "",
            "name-with-unsupported-chars-@",
            "name-with-unsupported-chars-#",
            repeat("name-too-long-", 50),
        ].forEach((name) => {
            it(`case: ${name}`, () => {
                expect(isAppNameValid(name)).to.equal(false);
            });
        });
    });
});
