import { expect } from "chai";

import { ExternalCacheNotFoundError } from "../../src/common/functionalErrors";
import GetExternalCache from "../../src/usecases/GetExternalCache";
import { getMockDependencies } from "../testUtils";

describe("usecase GetExternalCache", () => {
    it("throws ExternalCacheNotFoundError if an externalCache with the specified id doesn't exist", async () => {
        const getExternalCache = new GetExternalCache(getMockDependencies());
        const getExternalCachePromise = getExternalCache.exec(
            "externalCacheId"
        );
        await expect(getExternalCachePromise).to.be.rejectedWith(
            ExternalCacheNotFoundError
        );
        await expect(getExternalCachePromise).to.be.rejectedWith(
            "No external cache found with id = externalCacheId"
        );
    });

    it("returns the externalCache with the specified id", async () => {
        const deps = getMockDependencies();
        const mockExternalCache = {} as any;
        deps.storages.externalCaches.findOne.resolves(mockExternalCache);
        const getExternalCache = new GetExternalCache(deps);
        const externalCache = await getExternalCache.exec("externalCacheId");
        expect(externalCache).to.equal(mockExternalCache);
    });
});
