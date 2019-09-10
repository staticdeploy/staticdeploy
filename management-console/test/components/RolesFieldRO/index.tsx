import { expect } from "chai";
import { shallow } from "enzyme";
import React from "react";

import RolesFieldRO from "../../../src/components/RolesFieldRO";

describe("RolesFieldRO", () => {
    it("renders each role", () => {
        const rolesFieldRO = shallow(
            <RolesFieldRO
                title="title"
                roles={["root", "app-manager:12345678"]}
            />
        );
        expect(rolesFieldRO.contains("root")).to.equal(true);
        expect(rolesFieldRO.contains("app-manager:12345678")).to.equal(true);
    });
});
