import { expect } from "chai";
import sinon from "sinon";

import CheckHealth from "../../src/usecases/CheckHealth";
import { getMockDependencies } from "../testUtils";

describe("usecase CheckHealth", () => {
    it("returns the result returned by the storages health ckeck", async () => {
        const deps = getMockDependencies();
        deps.storages.checkHealth.resolves({ isHealthy: false, details: {} });
        const checkHealth = new CheckHealth(deps);
        const result = await checkHealth.exec();
        expect(result.isHealthy).to.equal(false);
    });

    it("when the request is authenticated, returns the details returned by storage healthchecks", async () => {
        const deps = getMockDependencies();
        deps.config.enforceAuth = true;
        deps.requestContext.authToken = "authToken";
        deps.authenticationStrategies.push({
            setup: sinon.stub(),
            getIdpUserFromAuthToken: sinon
                .stub<any, any>()
                .resolves({ idp: "idp", id: "idpId" }),
        });
        deps.storages.users.findOneWithRolesByIdpAndIdpId.resolves({} as any);
        deps.storages.checkHealth.resolves({ isHealthy: false, details: {} });
        const checkHealth = new CheckHealth(deps);
        const result = await checkHealth.exec();
        expect(result).to.have.property("details").that.deep.equals({});
    });

    it("when the request is NOT authenticated, doesn't return any details", async () => {
        const deps = getMockDependencies();
        deps.config.enforceAuth = true;
        deps.requestContext.authToken = null;
        deps.storages.checkHealth.resolves({ isHealthy: false, details: {} });
        const checkHealth = new CheckHealth(deps);
        const result = await checkHealth.exec();
        expect(result).to.have.property("details", undefined);
    });
});
