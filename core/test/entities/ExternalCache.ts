import { expect } from "chai";

import {
    getMatchingExternalCacheType,
    IExternalCacheType,
    isExternalCacheConfigurationValid,
    isExternalCacheDomainValid,
    isExternalCacheTypeSupported
} from "../../src/entities/ExternalCache";

describe("ExternalCache entity util getMatchingExternalCacheType", () => {
    const getExternalCacheTypes = (...names: string[]): IExternalCacheType[] =>
        names.map(name => ({
            name: name,
            label: "label",
            configurationFields: []
        }));

    it("returns the externalCacheType matching the passed in type, if one is found", () => {
        const supportedExternalCacheTypes = getExternalCacheTypes(
            "type0",
            "type1",
            "type2"
        );
        expect(
            getMatchingExternalCacheType(supportedExternalCacheTypes, "type1")
        ).to.have.property("name", "type1");
    });

    it("returns null if no externalCacheType is found matching the passed in type", () => {
        const supportedExternalCacheTypes = getExternalCacheTypes(
            "type0",
            "type1",
            "type2"
        );
        expect(
            getMatchingExternalCacheType(supportedExternalCacheTypes, "type3")
        ).to.equal(null);
    });
});

describe("ExternalCache entity validator isExternalCacheTypeSupported", () => {
    const getExternalCacheTypes = (...names: string[]): IExternalCacheType[] =>
        names.map(name => ({
            name: name,
            label: "label",
            configurationFields: []
        }));

    it("returns true when the passed-in type is found in the supported IExternalCacheType-s", () => {
        const testCases: [string, IExternalCacheType[]][] = [
            ["type", getExternalCacheTypes("type")],
            ["type0", getExternalCacheTypes("type0", "type1")],
            ["type1", getExternalCacheTypes("type0", "type1")]
        ];
        testCases.forEach(([type, supportedExternalCacheTypes]) => {
            expect(
                isExternalCacheTypeSupported(type, supportedExternalCacheTypes)
            ).to.equal(true);
        });
    });

    it("returns false when the passed-in type is NOT found in the supported IExternalCacheType-s", () => {
        const testCases: [string, IExternalCacheType[]][] = [
            ["type", getExternalCacheTypes("otherType")],
            ["type2", getExternalCacheTypes("type0", "type1")]
        ];
        testCases.forEach(([type, supportedExternalCacheTypes]) => {
            expect(
                isExternalCacheTypeSupported(type, supportedExternalCacheTypes)
            ).to.equal(false);
        });
    });
});

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
    const getExternalCacheType = (
        ...configurationFieldNames: string[]
    ): IExternalCacheType => ({
        name: "name",
        label: "label",
        configurationFields: configurationFieldNames.map(
            configurationFieldName => ({
                name: configurationFieldName,
                label: "label",
                placeholder: "placeholder"
            })
        )
    });

    describe("returns true when the passed-in configuration is valid", () => {
        const testCases: [any, IExternalCacheType][] = [
            [{}, getExternalCacheType()],
            [{ key: "value" }, getExternalCacheType("key")],
            [
                { key: "value", otherKey: "otherValue" },
                getExternalCacheType("key", "otherKey")
            ],
            [
                { "key-with-special-chars": "value" },
                getExternalCacheType("key-with-special-chars")
            ]
        ];
        testCases.forEach(([configuration, externalCacheType]) => {
            it(`case: ${JSON.stringify(configuration)}`, () => {
                expect(
                    isExternalCacheConfigurationValid(
                        configuration,
                        externalCacheType
                    )
                ).to.equal(true);
            });
        });
    });

    describe("returns false when the passed-in configuration is not valid", () => {
        const testCases: [any, IExternalCacheType][] = [
            ["not-an-object", getExternalCacheType()],
            [0, getExternalCacheType()],
            [true, getExternalCacheType()],
            [null, getExternalCacheType()],
            [[], getExternalCacheType()],
            [{ key: 0 }, getExternalCacheType("key")],
            [{ key: {} }, getExternalCacheType("key")],
            [{ key: [] }, getExternalCacheType("key")],
            [{ key: true }, getExternalCacheType("key")],
            [{ key: null }, getExternalCacheType("key")],
            [{ surplusKey: "surplusValue" }, getExternalCacheType()],
            [{ key: "value" }, getExternalCacheType("key", "missingKey")]
        ];
        testCases.forEach(([configuration, externalCacheType]) => {
            it(`case: ${JSON.stringify(configuration)}`, () => {
                expect(
                    isExternalCacheConfigurationValid(
                        configuration,
                        externalCacheType
                    )
                ).to.equal(false);
            });
        });
    });
});
