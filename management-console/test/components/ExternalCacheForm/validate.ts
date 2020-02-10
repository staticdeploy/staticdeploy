import { expect } from "chai";

import validate from "../../../src/components/ExternalCacheForm/validate";

describe("ExternalCacheForm validation function", () => {
    describe("domain validation", () => {
        it("requires a domain to be specified", () => {
            const errors = validate({}, { supportedExternalCacheTypes: [] });
            expect(errors).to.have.property("domain", "Required");
        });
        it("requires domain to be a valid domain name", () => {
            const errors = validate(
                { domain: "not-a-domain" },
                { supportedExternalCacheTypes: [] }
            );
            expect(errors).to.have.property(
                "domain",
                "Must be a valid domain name"
            );
        });
    });

    describe("type validation", () => {
        it("requires a type to be specified", () => {
            const errors = validate({}, { supportedExternalCacheTypes: [] });
            expect(errors).to.have.property("type", "Required");
        });
    });

    describe("configuration validation", () => {
        it("requires all the configuration fields of the specified external cache type to be specified", () => {
            const supportedExternalCacheTypes = [
                {
                    name: "type0",
                    label: "label0",
                    configurationFields: [
                        {
                            name: "name00",
                            label: "label00",
                            placeholder: "placeholder00"
                        },
                        {
                            name: "name01",
                            label: "label01",
                            placeholder: "placeholder01"
                        }
                    ]
                },
                {
                    name: "type1",
                    label: "label1",
                    configurationFields: [
                        {
                            name: "name10",
                            label: "label10",
                            placeholder: "placeholder10"
                        },
                        {
                            name: "name11",
                            label: "label11",
                            placeholder: "placeholder11"
                        }
                    ]
                }
            ];
            const errors = validate(
                { type: "type0" },
                { supportedExternalCacheTypes }
            );
            expect(errors).to.have.nested.property(
                "configuration.name00",
                "Required"
            );
            expect(errors).to.have.nested.property(
                "configuration.name01",
                "Required"
            );
        });
    });
});
