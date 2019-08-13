import { expect } from "chai";
import sinon from "sinon";

import AuthService from "../../../src/common/authService/AuthService";

const getMockAuthStrategy = () => ({
    name: "mock",
    getAuthToken: sinon.stub(),
    login: sinon.stub(),
    logout: sinon.stub()
});

describe("AuthService", () => {
    describe("constructor", () => {
        describe("after trying to get a token from the auth strategies", () => {
            it('sets the status to "logged in" if an auth token was received', async () => {
                const mockAuthStrategy = getMockAuthStrategy();
                mockAuthStrategy.getAuthToken.returns("authToken");
                const authService = new AuthService(1, [
                    mockAuthStrategy as any
                ]);
                expect(authService.getStatus()).to.have.property(
                    "authToken",
                    "authToken"
                );
            });

            it('sets the status to "logged out" if no auth token was received', async () => {
                const mockAuthStrategy = getMockAuthStrategy();
                mockAuthStrategy.getAuthToken.returns(null);
                const authService = new AuthService(1, [
                    mockAuthStrategy as any
                ]);
                expect(authService.getStatus()).to.have.property(
                    "authToken",
                    null
                );
            });
        });
    });

    describe("loginWith", () => {
        it("sets a login error if no auth strategy exists with the specified name", async () => {
            const authService = new AuthService(1, []);
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
            const authService = new AuthService(1, [mockAuthStrategy as any]);
            await authService.loginWith("mock");
            expect(mockAuthStrategy.login).to.have.callCount(1);
        });

        it('on login error, sets the status to "login error"', async () => {
            const mockAuthStrategy = getMockAuthStrategy();
            mockAuthStrategy.login.rejects(new Error("Error logging in"));
            const authService = new AuthService(1, [mockAuthStrategy as any]);
            await authService.loginWith("mock");
            expect(authService.getStatus())
                .to.have.property("loginError")
                .that.is.an.instanceOf(Error)
                .that.has.property("message", "Error logging in");
        });

        it('on login success, sets the status to "logged in"', async () => {
            const mockAuthStrategy = getMockAuthStrategy();
            mockAuthStrategy.getAuthToken.returns("authToken");
            const authService = new AuthService(1, [mockAuthStrategy as any]);
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
                "authToken",
                "authToken"
            );
        });
    });

    describe("logout", () => {
        it("calls each auth strategy logout method", async () => {
            const mockAuthStrategy0 = getMockAuthStrategy();
            const mockAuthStrategy1 = getMockAuthStrategy();
            const authService = new AuthService(1, [
                mockAuthStrategy0,
                mockAuthStrategy1
            ] as any);
            await authService.logout();
            expect(mockAuthStrategy0.logout).to.have.callCount(1);
            expect(mockAuthStrategy1.logout).to.have.callCount(1);
        });
    });
});
