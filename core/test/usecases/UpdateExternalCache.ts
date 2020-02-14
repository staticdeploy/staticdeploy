import { expect } from "chai";
import sinon, { SinonStub } from "sinon";

import {
    ConflictingExternalCacheError,
    ExternalCacheConfigurationNotValidError,
    ExternalCacheDomainNotValidError,
    ExternalCacheNotFoundError,
    ExternalCacheTypeNotSupportedError
} from "../../src/common/functionalErrors";
import IExternalCacheService from "../../src/dependencies/IExternalCacheService";
import { IExternalCacheType } from "../../src/entities/ExternalCache";
import { Operation } from "../../src/entities/OperationLog";
import UpdateExternalCache from "../../src/usecases/UpdateExternalCache";
import { getMockDependencies } from "../testUtils";

describe("usecase UpdateExternalCache", () => {
    const getMockExternalCacheService = (): {
        externalCacheType: IExternalCacheType;
        purge: SinonStub<
            Parameters<IExternalCacheService["purge"]>,
            ReturnType<IExternalCacheService["purge"]>
        >;
    } => ({
        externalCacheType: {
            name: "type",
            label: "label",
            configurationFields: []
        },
        purge: sinon.stub()
    });

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

    it("throws ExternalCacheTypeNotSupportedError if the type is not supported", async () => {
        const deps = getMockDependencies();
        deps.storages.externalCaches.findOne.resolves({} as any);
        const updateExternalCache = new UpdateExternalCache(deps);
        const updateExternalCachePromise = updateExternalCache.exec("id", {
            domain: "domain.com",
            type: "type",
            configuration: {}
        });
        await expect(updateExternalCachePromise).to.be.rejectedWith(
            ExternalCacheTypeNotSupportedError
        );
        await expect(updateExternalCachePromise).to.be.rejectedWith(
            "type is not a supported external cache type"
        );
    });

    it("throws ExternalCacheDomainNotValidError if the domain is not valid", async () => {
        const deps = getMockDependencies();
        deps.externalCacheServices.push(getMockExternalCacheService());
        deps.storages.externalCaches.findOne.resolves({ type: "type" } as any);
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

    it("throws ExternalCacheConfigurationNotValidError if the configuration is not valid", async () => {
        const deps = getMockDependencies();
        deps.externalCacheServices.push(getMockExternalCacheService());
        deps.storages.externalCaches.findOne.resolves({ type: "type" } as any);
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

    it("throws ConflictingExternalCacheError if an externalCache with the same domain exists", async () => {
        const deps = getMockDependencies();
        deps.externalCacheServices.push(getMockExternalCacheService());
        deps.storages.externalCaches.findOne.resolves({ type: "type" } as any);
        deps.storages.externalCaches.oneExistsWithDomain.resolves(true);
        const updateExternalCache = new UpdateExternalCache(deps);
        const updateExternalCachePromise = updateExternalCache.exec(
            "externalCacheId",
            { domain: "domain.com" }
        );
        await expect(updateExternalCachePromise).to.be.rejectedWith(
            ConflictingExternalCacheError
        );
        await expect(updateExternalCachePromise).to.be.rejectedWith(
            "An external cache with domain = domain.com already exists"
        );
    });

    it("updates the externalCache", async () => {
        const deps = getMockDependencies();
        deps.externalCacheServices.push(getMockExternalCacheService());
        deps.storages.externalCaches.findOne.resolves({ type: "type" } as any);
        const updateExternalCache = new UpdateExternalCache(deps);
        await updateExternalCache.exec("externalCacheId", {
            domain: "domain.com"
        });
        expect(
            deps.storages.externalCaches.updateOne
        ).to.have.been.calledOnceWith("externalCacheId", {
            domain: "domain.com",
            type: undefined,
            configuration: undefined,
            updatedAt: sinon.match.date
        });
    });

    it("logs the update externalCache operation", async () => {
        const deps = getMockDependencies();
        deps.externalCacheServices.push(getMockExternalCacheService());
        deps.storages.externalCaches.findOne.resolves({ type: "type" } as any);
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
        deps.externalCacheServices.push(getMockExternalCacheService());
        deps.storages.externalCaches.findOne.resolves({ type: "type" } as any);
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
