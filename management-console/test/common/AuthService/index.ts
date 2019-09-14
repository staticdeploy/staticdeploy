import { expect } from "chai";
import sinon from "sinon";

import AuthService from "../../../src/common/AuthService";

const getMockAuthStrategy = () => ({
    name: "mock",
    displayName: "mock",
    init: sinon.stub(),
    getAuthToken: sinon.stub(),
    login: sinon.stub(),
    logout: sinon.stub()
});

describe("AuthService", () => {
    describe("init", () => {
        it('sets the status to "logged in" if auth is not enforced', async () => {
            const authService = new AuthService(false, []);
            await authService.init();
            expect(authService.getStatus()).to.have.property(
                "isLoggedIn",
                true
            );
        });

        it("executes all auth stratedies init functions", async () => {
            const mockAuthStrategy0 = getMockAuthStrategy();
            const mockAuthStrategy1 = getMockAuthStrategy();
            const authService = new AuthService(true, [
                mockAuthStrategy0,
                mockAuthStrategy1
            ] as any);
            await authService.init();
            expect(mockAuthStrategy0.init).to.have.callCount(1);
            expect(mockAuthStrategy1.init).to.have.callCount(1);
        });

        it('sets the status to "logged in" if some auth strategy returns an auth token', async () => {
            const mockAuthStrategy = getMockAuthStrategy();
            mockAuthStrategy.getAuthToken.resolves("authToken");
            const authService = new AuthService(true, [
                mockAuthStrategy as any
            ]);
            await authService.init();
            expect(authService.getStatus()).to.have.property(
                "isLoggedIn",
                true
            );
        });

        it('sets the status to "logged out" if no auth strategy returns an auth token', async () => {
            const mockAuthStrategy = getMockAuthStrategy();
            mockAuthStrategy.getAuthToken.returns(null);
            const authService = new AuthService(true, [
                mockAuthStrategy as any
            ]);
            await authService.init();
            expect(authService.getStatus()).to.have.property(
                "isLoggedIn",
                false
            );
        });
    });

    describe("getAuthToken", () => {
        it("returns the authToken returned by one of the strategies", async () => {
            const mockAuthStrategy0 = getMockAuthStrategy();
            mockAuthStrategy0.getAuthToken.resolves(null);
            const mockAuthStrategy1 = getMockAuthStrategy();
            mockAuthStrategy1.getAuthToken.resolves("authToken1");
            const mockAuthStrategy2 = getMockAuthStrategy();
            mockAuthStrategy2.getAuthToken.resolves("authToken2");
            const authService = new AuthService(true, [
                mockAuthStrategy0,
                mockAuthStrategy1,
                mockAuthStrategy2
            ] as any);
            const authToken = await authService.getAuthToken();
            expect(authToken).to.equal("authToken1");
        });
    });

    describe("loginWith", () => {
        it("sets a login error if no auth strategy exists with the specified name", async () => {
            const authService = new AuthService(true, []);
            await authService.loginWith("mock");
            expect(authService.getStatus())
                .to.have.property("loginError")
                .that.is.an.instanceOf(Error)
                .that.has.property(
                    "message",
                    "No auth strategy found with name mock"
                );
        });

        it("calls the login function of the specified auth strategy", async () => {
            const mockAuthStrategy = getMockAuthStrategy();
            const authService = new AuthService(true, [
                mockAuthStrategy as any
            ]);
            await authService.loginWith("mock");
            expect(mockAuthStrategy.login).to.have.callCount(1);
        });

        it('on login error, sets the status to "login error"', async () => {
            const mockAuthStrategy = getMockAuthStrategy();
            mockAuthStrategy.login.rejects(new Error("Error logging in"));
            const authService = new AuthService(true, [
                mockAuthStrategy as any
            ]);
            await authService.loginWith("mock");
            expect(authService.getStatus())
                .to.have.property("loginError")
                .that.is.an.instanceOf(Error)
                .that.has.property("message", "Error logging in");
        });

        it('on login success, sets the status to "logged in"', async () => {
            const mockAuthStrategy = getMockAuthStrategy();
            mockAuthStrategy.getAuthToken.resolves("authToken");
            const authService = new AuthService(true, [
                mockAuthStrategy as any
            ]);
            await authService.loginWith("mock");
            expect(authService.getStatus()).to.have.property(
                "loginError",
                null
            );
            expect(authService.getStatus()).to.have.property(
                "isLoggingIn",
                false
            );
            expect(authService.getStatus()).to.have.property(
                "isLoggedIn",
                true
            );
        });
    });

    describe("logout", () => {
        it("calls each auth strategy logout method", async () => {
            const mockAuthStrategy0 = getMockAuthStrategy();
            const mockAuthStrategy1 = getMockAuthStrategy();
            const authService = new AuthService(true, [
                mockAuthStrategy0,
                mockAuthStrategy1
            ] as any);
            await authService.logout();
            expect(mockAuthStrategy0.logout).to.have.callCount(1);
            expect(mockAuthStrategy1.logout).to.have.callCount(1);
        });
    });
});
