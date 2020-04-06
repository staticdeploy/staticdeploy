import { expect } from "chai";

import validate from "../../../src/components/GroupForm/validate";

describe("GroupForm validation function", () => {
    describe("name validation", () => {
        it("requires a name to be specified", () => {
            const errors = validate({});
            expect(errors).to.have.property("name", "Required");
        });
    });

    describe("roles validation", () => {
        it("requires all roles to be non-empty", () => {
            const errors = validate({
                roles: [undefined] as any,
            });
            expect(errors).to.have.nested.property("roles.0", "Required");
        });
        it("requires all roles to be valid", () => {
            const errors = validate({
                roles: ["invalid-role"],
            });
            expect(errors).to.have.nested.property("roles.0", "Invalid role");
        });
    });
});
