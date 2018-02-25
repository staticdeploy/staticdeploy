import Alert from "antd/lib/alert";
import Spin from "antd/lib/spin";
import { expect } from "chai";
import { shallow } from "enzyme";
import React from "react";
import sinon from "sinon";

import LoginMask from "../../../src/components/LoginMask";
import LoginForm from "../../../src/components/LoginMask/LoginForm";

describe("LoginMask", () => {
    const authTokenService = {
        onStatusChange: sinon.spy(),
        offStatusChange: sinon.spy(),
        getStatus: sinon.stub(),
        setAuthToken: sinon.spy()
    };
    beforeEach(() => {
        authTokenService.onStatusChange.resetHistory();
        authTokenService.offStatusChange.resetHistory();
        authTokenService.getStatus.reset();
        authTokenService.getStatus.returns({});
        authTokenService.setAuthToken.resetHistory();
    });

    it("on mount, registers a listener for status changes", () => {
        shallow(<LoginMask authTokenService={authTokenService} />);
        expect(authTokenService.onStatusChange).to.have.callCount(1);
        expect(authTokenService.onStatusChange).to.have.been.calledWithMatch(
            sinon.match.func
        );
    });

    it("on unmount, de-registers the previously-registered listener for status changes", () => {
        const loginMask = shallow(
            <LoginMask authTokenService={authTokenService} />
        );
        const listener = authTokenService.onStatusChange.getCall(0).args[0];
        loginMask.unmount();
        expect(authTokenService.offStatusChange).to.have.callCount(1);
        expect(authTokenService.offStatusChange).to.have.been.calledWith(
            listener
        );
    });

    it("when the auth token is set, renders its children", () => {
        authTokenService.getStatus.returns({ isSet: true });
        const loginMask = shallow(
            <LoginMask authTokenService={authTokenService}>
                <div id="child" />
            </LoginMask>
        );
        expect(loginMask.find("div#child")).to.have.length(1);
    });

    it("when the auth token is being retrieved, renders a spinner", () => {
        authTokenService.getStatus.returns({ isRetrieving: true });
        const loginMask = shallow(
            <LoginMask authTokenService={authTokenService} />
        );
        expect(loginMask.find(Spin)).to.have.length(1);
    });

    it("when an error occurred retrieving the auth token, renders the error message", () => {
        authTokenService.getStatus.returns({
            retrievingError: new Error("Retrieving error message")
        });
        const loginMask = shallow(
            <LoginMask authTokenService={authTokenService} />
        );
        expect(loginMask.find(Alert).prop("description")).to.equal(
            "Retrieving error message"
        );
    });

    it("when the token is not set, it is not being retrieved, and there were no errors retrieving it, renders the login form", () => {
        const loginMask = shallow(
            <LoginMask authTokenService={authTokenService} />
        );
        expect(loginMask.find(LoginForm)).to.have.length(1);
    });

    it("when the user submits the login form, sets the auth token to the value entered by the user", () => {
        const loginMask = shallow(
            <LoginMask authTokenService={authTokenService} />
        );
        loginMask
            .find(LoginForm)
            .simulate("submit", { authToken: "authToken" });
        expect(authTokenService.setAuthToken).to.have.callCount(1);
        expect(authTokenService.setAuthToken).to.have.been.calledWith(
            "authToken"
        );
    });
});
