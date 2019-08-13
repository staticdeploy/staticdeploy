import { expect } from "chai";
import { shallow } from "enzyme";
import React from "react";
import sinon from "sinon";

import LogoutButton from "../../../src/components/LogoutButton";

describe("LogoutButton", () => {
    it("on click, calls the authService logout method", () => {
        const authService = { logout: sinon.spy() };
        const logoutButton = shallow(
            <LogoutButton authService={authService as any} />
        );
        logoutButton.find("div").simulate("click");
        expect(authService.logout).to.have.callCount(1);
    });
});
