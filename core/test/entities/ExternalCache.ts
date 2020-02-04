import { expect } from "chai";

import {
    isExternalCacheConfigurationValid,
    isExternalCacheDomainValid
} from "../../src/entities/ExternalCache";

describe("ExternalCache entity validator isExternalCacheDomainValid", () => {
    describe("returns true when the passed-in domain is a valid FQDN", () => {
        ["domain.com", "sub.domain.com"].forEach(domain => {
            it(`case: ${domain}`, () => {
                expect(isExternalCacheDomainValid(domain)).to.equal(true);
            });
        });
    });

    describe("returns false when the passed-in domain is not a valid FQDN", () => {
        ["", "https://domain.com", "domain.com/"].forEach(domain => {
            it(`case: ${domain}`, () => {
                expect(isExternalCacheDomainValid(domain)).to.equal(false);
            });
        });
    });
});

describe("ExternalCache entity validator isExternalCacheConfigurationValid", () => {
    describe("returns true when the passed-in configuration is a (string, string) dictionary", () => {
        [
            {},
            { key: "value" },
            { key: "value", otherKey: "otherValue" },
            { "key-with-special-chars": "value" }
        ].forEach(configuration => {
            it(`case: ${JSON.stringify(configuration)}`, () => {
                expect(
                    isExternalCacheConfigurationValid(configuration)
                ).to.equal(true);
            });
        });
    });

    describe("returns false when the passed-in configuration is not a (string, string) dictionary", () => {
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
                expect(
                    isExternalCacheConfigurationValid(configuration)
                ).to.equal(false);
            });
        });
    });
});
