import { expect } from "chai";

import { AuthEnforcementLevel } from "../../src/dependencies/IUsecaseConfig";
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
        deps.config.authEnforcementLevel = AuthEnforcementLevel.Authorization;
        deps.requestContext.idpUser = { id: "id", idp: "idp" };
        deps.storages.users.findOneWithRolesByIdpAndIdpId.resolves({} as any);
        deps.storages.checkHealth.resolves({ isHealthy: false, details: {} });
        const checkHealth = new CheckHealth(deps);
        const result = await checkHealth.exec();
        expect(result)
            .to.have.property("details")
            .that.deep.equals({});
    });

    it("when the request is NOT authenticated, doesn't return any details", async () => {
        const deps = getMockDependencies();
        deps.config.authEnforcementLevel = AuthEnforcementLevel.Authorization;
        deps.requestContext.idpUser = null;
        deps.storages.checkHealth.resolves({ isHealthy: false, details: {} });
        const checkHealth = new CheckHealth(deps);
        const result = await checkHealth.exec();
        expect(result).to.have.property("details", undefined);
    });
});
