import { expect } from "chai";

import validate from "../../../src/components/EntrypointForm/validate";

describe("EntrypointForm validation function", () => {
    describe("urlMatcher validation", () => {
        it("requires a urlMatcher to be specified", () => {
            const errors = validate({});
            expect(errors).to.have.property("urlMatcher", "Required");
        });
        describe("requires urlMatcher to have format domain + path + /", () => {
            it("case: invalid domain", () => {
                const errors = validate({ urlMatcher: "domain..com/path/" });
                expect(errors).to.have.property(
                    "urlMatcher",
                    "Must have format: domain + path + trailing slash"
                );
            });
            it("case: invalid path", () => {
                const errors = validate({ urlMatcher: "domain.com/../path/" });
                expect(errors).to.have.property(
                    "urlMatcher",
                    "Must have format: domain + path + trailing slash"
                );
            });
            it("case: no trailing slash", () => {
                const errors = validate({ urlMatcher: "domain.com/path" });
                expect(errors).to.have.property(
                    "urlMatcher",
                    "Must have format: domain + path + trailing slash"
                );
            });
            it("case: valid", () => {
                const errors = validate({ urlMatcher: "domain.com/path/" });
                expect(errors).not.to.have.property("urlMatcher");
            });
        });
    });

    describe("configuration validation", () => {
        it("requires all configuration keys to be non-empty", () => {
            const errors = validate({
                configuration: [{ key: "", value: "" }],
            });
            expect(errors).to.have.nested.property(
                "configuration.0.key",
                "Required"
            );
        });
        it("requires all configuration keys to be unique", () => {
            const errors = validate({
                configuration: [
                    { key: "key", value: "" },
                    { key: "key", value: "" },
                ],
            });
            expect(errors).to.have.nested.property(
                "configuration.0.key",
                "Duplicate"
            );
            expect(errors).to.have.nested.property(
                "configuration.1.key",
                "Duplicate"
            );
        });
    });
});
