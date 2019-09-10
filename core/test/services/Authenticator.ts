import { expect } from "chai";

import IAuthenticationStrategy from "../../src/dependencies/IAuthenticationStrategy";
import Authenticator from "../../src/services/Authenticator";

describe("service Authenticator", () => {
    describe("getIdpUser", () => {
        const setup = () => Promise.resolve();
        const idpUser0 = { id: "id0", idp: "idp0" };
        const idpUser1 = { id: "id1", idp: "idp1" };

        it("returns null if the passed in auth token is null", async () => {
            const authenticationStrategies: IAuthenticationStrategy[] = [
                { getIdpUserFromAuthToken: async () => idpUser0, setup }
            ];
            const authenticator = new Authenticator(
                authenticationStrategies,
                null
            );
            const idpUser = await authenticator.getIdpUser();
            expect(idpUser).to.equal(null);
        });

        describe("returns the first non-null idp user returned by one of the authentications trategies", () => {
            it("case: first authentication strategy returns a non-null idp user", async () => {
                const authenticationStrategies: IAuthenticationStrategy[] = [
                    { getIdpUserFromAuthToken: async () => idpUser0, setup },
                    { getIdpUserFromAuthToken: async () => null, setup }
                ];
                const authenticator = new Authenticator(
                    authenticationStrategies,
                    "authToken"
                );
                const idpUser = await authenticator.getIdpUser();
                expect(idpUser).to.equal(idpUser0);
            });

            it("case: second authentication strategy returns a non-null idp user", async () => {
                const authenticationStrategies: IAuthenticationStrategy[] = [
                    { getIdpUserFromAuthToken: async () => null, setup },
                    { getIdpUserFromAuthToken: async () => idpUser1, setup }
                ];
                const authenticator = new Authenticator(
                    authenticationStrategies,
                    "authToken"
                );
                const idpUser = await authenticator.getIdpUser();
                expect(idpUser).to.equal(idpUser1);
            });

            it("case: first and second authentication strategy return a non-null idp user", async () => {
                const authenticationStrategies: IAuthenticationStrategy[] = [
                    { getIdpUserFromAuthToken: async () => idpUser0, setup },
                    { getIdpUserFromAuthToken: async () => idpUser1, setup }
                ];
                const authenticator = new Authenticator(
                    authenticationStrategies,
                    "authToken"
                );
                const idpUser = await authenticator.getIdpUser();
                expect(idpUser).to.equal(idpUser0);
            });
        });

        describe("returns null if all authentication strategies return null", () => {
            it("case: 0 authentication strategies", async () => {
                const authenticator = new Authenticator([], "authToken");
                const idpUser = await authenticator.getIdpUser();
                expect(idpUser).to.equal(null);
            });

            it("case: 1 authentication strategy", async () => {
                const authenticationStrategies: IAuthenticationStrategy[] = [
                    { getIdpUserFromAuthToken: async () => null, setup }
                ];
                const authenticator = new Authenticator(
                    authenticationStrategies,
                    "authToken"
                );
                const idpUser = await authenticator.getIdpUser();
                expect(idpUser).to.equal(null);
            });

            it("case: multiple authentication strategies", async () => {
                const authenticationStrategies: IAuthenticationStrategy[] = [
                    { getIdpUserFromAuthToken: async () => null, setup },
                    { getIdpUserFromAuthToken: async () => null, setup }
                ];
                const authenticator = new Authenticator(
                    authenticationStrategies,
                    "authToken"
                );
                const idpUser = await authenticator.getIdpUser();
                expect(idpUser).to.equal(null);
            });
        });
    });
});
