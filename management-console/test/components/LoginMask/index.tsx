import Spin from "antd/lib/spin";
import { expect } from "chai";
import { shallow } from "enzyme";
import React from "react";
import sinon from "sinon";

import ErrorAlert from "../../../src/components/ErrorAlert";
import LoginMask from "../../../src/components/LoginMask";
import JwtLogin from "../../../src/components/LoginMask/JwtLogin";
import OidcLogin from "../../../src/components/LoginMask/OidcLogin";

describe("LoginMask", () => {
    const getMockAuthService = () => ({
        onStatusChange: sinon.stub(),
        offStatusChange: sinon.stub(),
        getStatus: sinon.stub(),
        authEnforced: true,
        hasAuthStrategy: sinon.stub(),
        getStrategyDisplayName: sinon.stub()
    });

    describe("when the user is not logged in", () => {
        it("when the oidc auth strategy is used, renders an OidcLogin", () => {
            const mockAuthService = getMockAuthService();
            mockAuthService.hasAuthStrategy.withArgs("oidc").returns(true);
            mockAuthService.getStatus.returns({
                authToken: null,
                isLoggingIn: false,
                isLoggedIn: false,
                loginError: null
            });
            const loginMask = shallow(
                <LoginMask authService={mockAuthService as any} />
            );
            expect(loginMask.find(OidcLogin)).to.have.length(1);
        });

        it("when the jwt auth strategy is used, renders an JwtLogin", () => {
            const mockAuthService = getMockAuthService();
            mockAuthService.hasAuthStrategy.withArgs("jwt").returns(true);
            mockAuthService.getStatus.returns({
                authToken: null,
                isLoggingIn: false,
                isLoggedIn: false,
                loginError: null
            });
            const loginMask = shallow(
                <LoginMask authService={mockAuthService as any} />
            );
            expect(loginMask.find(JwtLogin)).to.have.length(1);
        });
    });

    it("when the user is logging in, renders a spinner", () => {
        const mockAuthService = getMockAuthService();
        mockAuthService.getStatus.returns({
            authToken: null,
            isLoggingIn: true,
            isLoggedIn: false,
            loginError: null
        });
        const loginMask = shallow(
            <LoginMask authService={mockAuthService as any} />
        );
        expect(loginMask.find(Spin)).to.have.length(1);
        expect(loginMask.find(Spin).prop("spinning")).to.equal(true);
    });

    it("when an error occurred logging in, renders an error message", () => {
        const mockAuthService = getMockAuthService();
        mockAuthService.getStatus.returns({
            authToken: null,
            isLoggingIn: false,
            isLoggedIn: false,
            loginError: new Error("Error logging in")
        });
        const loginMask = shallow(
            <LoginMask authService={mockAuthService as any} />
        );
        expect(loginMask.find(ErrorAlert).prop("message")).to.equal(
            "Error logging in"
        );
    });

    it("when auth is not enforced, renders its children", () => {
        const mockAuthService = getMockAuthService();
        mockAuthService.getStatus.returns({
            authToken: null,
            isLoggingIn: false,
            isLoggedIn: true,
            loginError: null
        });
        mockAuthService.authEnforced = false;
        const loginMask = shallow(
            <LoginMask authService={mockAuthService as any}>
                <div id="child" />
            </LoginMask>
        );
        expect(loginMask.find("div#child")).to.have.length(1);
    });

    it("when the user is logged in, renders its children", () => {
        const mockAuthService = getMockAuthService();
        mockAuthService.getStatus.returns({
            authToken: "authToken",
            isLoggingIn: false,
            isLoggedIn: true,
            loginError: null
        });
        const loginMask = shallow(
            <LoginMask authService={mockAuthService as any}>
                <div id="child" />
            </LoginMask>
        );
        expect(loginMask.find("div#child")).to.have.length(1);
    });
});
