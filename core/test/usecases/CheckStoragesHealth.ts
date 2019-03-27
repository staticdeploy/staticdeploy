import { expect } from "chai";

import CheckStoragesHealth from "../../src/usecases/CheckStoragesHealth";
import { getMockDependencies } from "../testUtils";

describe("usecase CheckStoragesHealth", () => {
    it("when every storage healthcheck succeedes, returns a healthy result", async () => {
        const deps = getMockDependencies();
        deps.appsStorage.checkHealth.resolves({ isHealthy: true });
        deps.bundlesStorage.checkHealth.resolves({ isHealthy: true });
        deps.entrypointsStorage.checkHealth.resolves({ isHealthy: true });
        deps.operationLogsStorage.checkHealth.resolves({ isHealthy: true });
        const checkStoragesHealth = new CheckStoragesHealth(deps);
        const result = await checkStoragesHealth.exec();
        expect(result).to.have.property("isHealthy", true);
    });

    it("when one storage healthcheck fails, returns a non-healthy result", async () => {
        const deps = getMockDependencies();
        deps.appsStorage.checkHealth.resolves({ isHealthy: false });
        deps.bundlesStorage.checkHealth.resolves({ isHealthy: true });
        deps.entrypointsStorage.checkHealth.resolves({ isHealthy: true });
        deps.operationLogsStorage.checkHealth.resolves({ isHealthy: true });
        const checkStoragesHealth = new CheckStoragesHealth(deps);
        const result = await checkStoragesHealth.exec();
        expect(result).to.have.property("isHealthy", false);
    });

    it("when more than one storage healthchecks fail, returns a non-healthy result", async () => {
        const deps = getMockDependencies();
        deps.appsStorage.checkHealth.resolves({ isHealthy: false });
        deps.bundlesStorage.checkHealth.resolves({ isHealthy: false });
        deps.entrypointsStorage.checkHealth.resolves({ isHealthy: true });
        deps.operationLogsStorage.checkHealth.resolves({ isHealthy: true });
        const checkStoragesHealth = new CheckStoragesHealth(deps);
        const result = await checkStoragesHealth.exec();
        expect(result).to.have.property("isHealthy", false);
    });

    it("when the request is authenticated, returns an aggregate of the details returned by storage healthchecks", async () => {
        const deps = getMockDependencies();
        deps.appsStorage.checkHealth.resolves({ isHealthy: false, details: 0 });
        deps.bundlesStorage.checkHealth.resolves({
            isHealthy: false,
            details: 1
        });
        deps.entrypointsStorage.checkHealth.resolves({
            isHealthy: true,
            details: 2
        });
        deps.operationLogsStorage.checkHealth.resolves({
            isHealthy: true,
            details: 3
        });
        const checkStoragesHealth = new CheckStoragesHealth(deps);
        const result = await checkStoragesHealth.exec();
        expect(result)
            .to.have.property("details")
            .that.deep.equals({
                appsStorage: 0,
                bundlesStorage: 1,
                entrypointsStorage: 2,
                operationLogsStorage: 3
            });
    });

    it("when the request is NOT authenticated, doesn't return any details", async () => {
        const deps = getMockDependencies();
        deps.requestContext.userId = null;
        deps.appsStorage.checkHealth.resolves({ isHealthy: false, details: 0 });
        deps.bundlesStorage.checkHealth.resolves({
            isHealthy: false,
            details: 1
        });
        deps.entrypointsStorage.checkHealth.resolves({
            isHealthy: true,
            details: 2
        });
        deps.operationLogsStorage.checkHealth.resolves({
            isHealthy: true,
            details: 3
        });
        const checkStoragesHealth = new CheckStoragesHealth(deps);
        const result = await checkStoragesHealth.exec();
        expect(result).to.have.property("details", undefined);
    });
});
