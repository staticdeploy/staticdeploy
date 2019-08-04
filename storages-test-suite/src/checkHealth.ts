import { IStorages } from "@staticdeploy/core";
import { expect } from "chai";

export default (storages: IStorages) => {
    describe("checkHealth", () => {
        it("returns the status of the storages", async () => {
            const healthCheckResult = await storages.checkHealth();
            expect(healthCheckResult).to.have.property("isHealthy", true);
        });
    });
};
