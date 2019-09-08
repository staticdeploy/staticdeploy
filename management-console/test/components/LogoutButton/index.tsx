import { expect } from "chai";
import { shallow } from "enzyme";
import React from "react";
import sinon from "sinon";

import LogoutButton from "../../../src/components/LogoutButton";

describe("LogoutButton", () => {
    it("doesn't render when auth is not enforced", () => {
        const authService = { authEnforced: false };
        const logoutButton = shallow(
            <LogoutButton authService={authService as any} />
        );
        expect(logoutButton.isEmptyRender()).to.equal(true);
    });

    it("on click, calls the authService logout method", () => {
        const authService = { authEnforced: true, logout: sinon.spy() };
        const logoutButton = shallow(
            <LogoutButton authService={authService as any} />
        );
        logoutButton.find("div").simulate("click");
        expect(authService.logout).to.have.callCount(1);
    });
});
