import { expect } from "chai";

import validate from "../../../src/components/UserForm/validate";

describe("UserForm validation function", () => {
    describe("idp validation", () => {
        it("requires an idp to be specified", () => {
            const errors = validate({});
            expect(errors).to.have.property("idp", "Required");
        });
    });

    describe("name validation", () => {
        it("requires an idpId to be specified", () => {
            const errors = validate({});
            expect(errors).to.have.property("idpId", "Required");
        });
    });

    describe("name validation", () => {
        it("requires a name to be specified", () => {
            const errors = validate({});
            expect(errors).to.have.property("name", "Required");
        });
    });
});
