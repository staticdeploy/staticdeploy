import { expect } from "chai";
import { shallow } from "enzyme";
import React from "react";
import sinon from "sinon";

import LogoutButton from "../../../src/components/LogoutButton";

describe("LogoutButton", () => {
    it("on click, sets the auth token to null", () => {
        const authTokenService: any = { setAuthToken: sinon.spy() };
        const logoutButton = shallow(
            <LogoutButton authTokenService={authTokenService} />
        );
        logoutButton.find("div").simulate("click");
        expect(authTokenService.setAuthToken).to.have.callCount(1);
        expect(authTokenService.setAuthToken).to.have.been.calledWith(null);
    });
});
