import { expect } from "chai";

import validate from "../../../src/components/AppForm/validate";

describe("AppForm validation function", () => {
    describe("name validation", () => {
        it("requires a name to be specified", () => {
            const errors = validate({});
            expect(errors).to.have.property("name", "Required");
        });
        it("requires name to only contain letters, numbers and hyphens", () => {
            const errors = validate({ name: "_" });
            expect(errors).to.have.property(
                "name",
                "Can only contain letters, numbers and hyphens"
            );
        });
    });

    describe("defaultConfiguration validation", () => {
        it("requires all configuration keys to be non-empty", () => {
            const errors = validate({
                defaultConfiguration: [{ key: "", value: "" }]
            });
            expect(errors).to.have.nested.property(
                "defaultConfiguration.0.key",
                "Required"
            );
        });
        it("requires all configuration keys to be unique", () => {
            const errors = validate({
                defaultConfiguration: [
                    { key: "key", value: "" },
                    { key: "key", value: "" }
                ]
            });
            expect(errors).to.have.nested.property(
                "defaultConfiguration.0.key",
                "Duplicate"
            );
            expect(errors).to.have.nested.property(
                "defaultConfiguration.1.key",
                "Duplicate"
            );
        });
    });
});
