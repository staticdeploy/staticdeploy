import { expect } from "chai";
import sinon from "sinon";

import GetCurrentUser from "../../src/usecases/GetCurrentUser";
import { getMockDependencies } from "../testUtils";

describe("usecase GetCurrentUser", () => {
    describe("returns the user executing the usecase", () => {
        it("case: enforceAuth = false", async () => {
            const deps = getMockDependencies();
            const getCurrentUser = new GetCurrentUser(deps);
            const currentUser = await getCurrentUser.exec();
            expect(currentUser).to.equal(null);
        });
        it("case: enforceAuth = true", async () => {
            const deps = getMockDependencies();
            deps.config.enforceAuth = true;
            deps.requestContext = { authToken: "authToken" };
            const mockUser = {} as any;
            deps.authenticationStrategies.push({
                getIdpUserFromAuthToken: sinon
                    .stub()
                    .resolves({ id: "id", idp: "idp" }),
            } as any);
            deps.storages.users.findOneWithRolesByIdpAndIdpId.resolves(
                mockUser
            );
            const getCurrentUser = new GetCurrentUser(deps);
            const currentUser = await getCurrentUser.exec();
            expect(currentUser).to.equal(mockUser);
        });
    });
});
