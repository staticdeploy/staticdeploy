import { expect } from "chai";

import CheckStoragesHealth from "../../src/usecases/CheckStoragesHealth";
import { getMockDependencies } from "../testUtils";

describe("usecase CheckStoragesHealth", () => {
    it("returns the result returned by the storages health ckeck", async () => {
        const deps = getMockDependencies();
        deps.storages.checkHealth.resolves({ isHealthy: false, details: {} });
        const checkStoragesHealth = new CheckStoragesHealth(deps);
        const result = await checkStoragesHealth.exec();
        expect(result.isHealthy).to.equal(false);
    });

    it("when the request is authenticated, returns the details returned by storage healthchecks", async () => {
        const deps = getMockDependencies();
        deps.storages.checkHealth.resolves({ isHealthy: false, details: {} });
        const checkStoragesHealth = new CheckStoragesHealth(deps);
        const result = await checkStoragesHealth.exec();
        expect(result)
            .to.have.property("details")
            .that.deep.equals({});
    });

    it("when the request is NOT authenticated, doesn't return any details", async () => {
        const deps = getMockDependencies();
        deps.requestContext.userId = null;
        deps.storages.checkHealth.resolves({ isHealthy: false, details: {} });
        const checkStoragesHealth = new CheckStoragesHealth(deps);
        const result = await checkStoragesHealth.exec();
        expect(result).to.have.property("details", undefined);
    });
});
