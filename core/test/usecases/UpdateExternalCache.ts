import { expect } from "chai";
import sinon from "sinon";

import {
    ExternalCacheConfigurationNotValidError,
    ExternalCacheDomainNotValidError,
    ExternalCacheNotFoundError
} from "../../src/common/errors";
import { Operation } from "../../src/entities/OperationLog";
import UpdateExternalCache from "../../src/usecases/UpdateExternalCache";
import { getMockDependencies } from "../testUtils";

describe("usecase UpdateExternalCache", () => {
    it("throws ExternalCacheNotFoundError if no externalCache with the specified id exists", async () => {
        const updateExternalCache = new UpdateExternalCache(
            getMockDependencies()
        );
        const updateExternalCachePromise = updateExternalCache.exec(
            "externalCacheId",
            {}
        );
        await expect(updateExternalCachePromise).to.be.rejectedWith(
            ExternalCacheNotFoundError
        );
        await expect(updateExternalCachePromise).to.be.rejectedWith(
            "No external cache found with id = externalCacheId"
        );
    });

    it("throws ExternalCacheConfigurationNotValidError if the configuration is not valid", async () => {
        const deps = getMockDependencies();
        deps.storages.externalCaches.findOne.resolves({} as any);
        const updateExternalCache = new UpdateExternalCache(deps);
        const updateExternalCachePromise = updateExternalCache.exec(
            "externalCacheId",
            { configuration: "not-valid-configuration" as any }
        );
        await expect(updateExternalCachePromise).to.be.rejectedWith(
            ExternalCacheConfigurationNotValidError
        );
        await expect(updateExternalCachePromise).to.be.rejectedWith(
            "Invalid external cache configuration object"
        );
    });

    it("throws ExternalCacheDomainNotValidError if the domain is not valid", async () => {
        const deps = getMockDependencies();
        deps.storages.externalCaches.findOne.resolves({} as any);
        const updateExternalCache = new UpdateExternalCache(deps);
        const updateExternalCachePromise = updateExternalCache.exec(
            "externalCacheId",
            { domain: "https://domain.com" }
        );
        await expect(updateExternalCachePromise).to.be.rejectedWith(
            ExternalCacheDomainNotValidError
        );
        await expect(updateExternalCachePromise).to.be.rejectedWith(
            "https://domain.com is not a valid domain name"
        );
    });

    it("updates the externalCache", async () => {
        const deps = getMockDependencies();
        deps.storages.externalCaches.findOne.resolves({} as any);
        const updateExternalCache = new UpdateExternalCache(deps);
        await updateExternalCache.exec("externalCacheId", {
            configuration: {}
        });
        expect(
            deps.storages.externalCaches.updateOne
        ).to.have.been.calledOnceWith("externalCacheId", {
            domain: undefined,
            type: undefined,
            configuration: {},
            updatedAt: sinon.match.date
        });
    });

    it("logs the update externalCache operation", async () => {
        const deps = getMockDependencies();
        deps.storages.externalCaches.findOne.resolves({} as any);
        const updateExternalCache = new UpdateExternalCache(deps);
        await updateExternalCache.exec("externalCacheId", {});
        expect(
            deps.storages.operationLogs.createOne
        ).to.have.been.calledOnceWith(
            sinon.match.has("operation", Operation.UpdateExternalCache)
        );
    });

    it("returns the updated externalCache", async () => {
        const deps = getMockDependencies();
        const mockUpdatedExternalCache = {} as any;
        deps.storages.externalCaches.findOne.resolves({} as any);
        deps.storages.externalCaches.updateOne.resolves(
            mockUpdatedExternalCache
        );
        const updateExternalCache = new UpdateExternalCache(deps);
        const updatedExternalCache = await updateExternalCache.exec(
            "externalCacheId",
            {}
        );
        expect(updatedExternalCache).to.equal(mockUpdatedExternalCache);
    });
});
