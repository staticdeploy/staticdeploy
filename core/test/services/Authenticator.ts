import { expect } from "chai";

import { NoUserCorrespondingToIdpUserError } from "../../src/common/functionalErrors";
import IAuthenticationStrategy from "../../src/dependencies/IAuthenticationStrategy";
import Authenticator from "../../src/services/Authenticator";
import { getMockDependencies } from "../testUtils";

describe("service Authenticator", () => {
    describe("getUser", () => {
        const setup = () => Promise.resolve();
        const idpUser0 = { id: "id0", idp: "idp0" };
        const idpUser1 = { id: "id1", idp: "idp1" };

        it("returns null when auth is not enforced", async () => {
            const deps = getMockDependencies();
            const authenticator = new Authenticator(
                deps.storages.users,
                deps.authenticationStrategies,
                false,
                null
            );
            const user = await authenticator.getUser();
            expect(user).to.equal(null);
        });

        describe("returns null when no idp user is found", () => {
            it("case: null authToken", async () => {
                const deps = getMockDependencies();
                const authenticator = new Authenticator(
                    deps.storages.users,
                    deps.authenticationStrategies,
                    true,
                    null
                );
                const user = await authenticator.getUser();
                expect(user).to.equal(null);
            });
            describe("case: all auth strategies return null", () => {
                it("case: 0 auth strategies", async () => {
                    const authenticator = new Authenticator(
                        getMockDependencies().storages.users,
                        [],
                        true,
                        "authToken"
                    );
                    const user = await authenticator.getUser();
                    expect(user).to.equal(null);
                });
                it("case: 1 auth strategy", async () => {
                    const authenticationStrategies: IAuthenticationStrategy[] = [
                        { getIdpUserFromAuthToken: async () => null, setup }
                    ];
                    const authenticator = new Authenticator(
                        getMockDependencies().storages.users,
                        authenticationStrategies,
                        true,
                        "authToken"
                    );
                    const user = await authenticator.getUser();
                    expect(user).to.equal(null);
                });
                it("case: multiple auth strategies", async () => {
                    const authenticationStrategies: IAuthenticationStrategy[] = [
                        { getIdpUserFromAuthToken: async () => null, setup },
                        { getIdpUserFromAuthToken: async () => null, setup }
                    ];
                    const authenticator = new Authenticator(
                        getMockDependencies().storages.users,
                        authenticationStrategies,
                        true,
                        "authToken"
                    );
                    const user = await authenticator.getUser();
                    expect(user).to.equal(null);
                });
            });
        });

        it("throws NoUserCorrespondingToIdpUserError when no user corresponds to the idp user", async () => {
            const deps = getMockDependencies();
            deps.storages.users.findOneWithRolesByIdpAndIdpId.resolves(null);
            const authenticationStrategies: IAuthenticationStrategy[] = [
                {
                    getIdpUserFromAuthToken: async () => idpUser0,
                    setup
                }
            ];
            const authenticator = new Authenticator(
                deps.storages.users,
                authenticationStrategies,
                true,
                "authToken"
            );
            const getUserPromise = authenticator.getUser();
            await expect(getUserPromise).to.be.rejectedWith(
                NoUserCorrespondingToIdpUserError
            );
            await expect(getUserPromise).to.be.rejectedWith(
                "Access denied. To gain access, ask an admin to create a user with idp = idp0 and idpId = id0"
            );
        });

        describe("returns the user corresponding to the first idp user returned by an auth strategy", () => {
            const deps = getMockDependencies();
            deps.storages.users.findOneWithRolesByIdpAndIdpId
                .withArgs(idpUser0.idp, idpUser0.id)
                .resolves({ id: idpUser0.id } as any)
                .withArgs(idpUser1.idp, idpUser1.id)
                .resolves({ id: idpUser1.id } as any);

            it("case: first auth strategy returns a non-null idp user", async () => {
                const authenticationStrategies: IAuthenticationStrategy[] = [
                    {
                        getIdpUserFromAuthToken: async () => idpUser0,
                        setup
                    },
                    {
                        getIdpUserFromAuthToken: async () => null,
                        setup
                    }
                ];
                const authenticator = new Authenticator(
                    deps.storages.users,
                    authenticationStrategies,
                    true,
                    "authToken"
                );
                const user = await authenticator.getUser();
                expect(user).to.have.property("id", idpUser0.id);
            });
            it("case: second auth strategy returns a non-null idp user", async () => {
                const authenticationStrategies: IAuthenticationStrategy[] = [
                    {
                        getIdpUserFromAuthToken: async () => null,
                        setup
                    },
                    {
                        getIdpUserFromAuthToken: async () => idpUser1,
                        setup
                    }
                ];
                const authenticator = new Authenticator(
                    deps.storages.users,
                    authenticationStrategies,
                    true,
                    "authToken"
                );
                const user = await authenticator.getUser();
                expect(user).to.have.property("id", idpUser1.id);
            });
            it("case: first AND second auth strategy returns a non-null idp user", async () => {
                const authenticationStrategies: IAuthenticationStrategy[] = [
                    {
                        getIdpUserFromAuthToken: async () => idpUser0,
                        setup
                    },
                    {
                        getIdpUserFromAuthToken: async () => idpUser1,
                        setup
                    }
                ];
                const authenticator = new Authenticator(
                    deps.storages.users,
                    authenticationStrategies,
                    true,
                    "authToken"
                );
                const user = await authenticator.getUser();
                expect(user).to.have.property("id", idpUser0.id);
            });
        });
    });
});
