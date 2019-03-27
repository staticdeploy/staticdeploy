import { expect } from "chai";

import { isConfigurationValid } from "../../src/entities/Configuration";

describe("Configuration entity validator isConfigurationValid", () => {
    describe("returns true when the passed-in configuration is valid", () => {
        [
            {},
            { key: "value" },
            { key: "value", otherKey: "otherValue" },
            { "key-with-special-chars": "value" }
        ].forEach(configuration => {
            it(`case: ${JSON.stringify(configuration)}`, () => {
                expect(isConfigurationValid(configuration)).to.equal(true);
            });
        });
    });

    describe("returns false when the passed-in configuration is not valid", () => {
        [
            "not-an-object",
            0,
            true,
            null,
            [],
            { key: 0 },
            { key: {} },
            { key: [] },
            { key: true },
            { key: null }
        ].forEach(configuration => {
            it(`case: ${JSON.stringify(configuration)}`, () => {
                expect(isConfigurationValid(configuration)).to.equal(false);
            });
        });
    });
});
