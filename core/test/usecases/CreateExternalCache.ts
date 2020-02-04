import { expect } from "chai";
import sinon from "sinon";

import {
    ExternalCacheConfigurationNotValidError,
    ExternalCacheDomainNotValidError,
    ConflictingExternalCacheError
} from "../../src/common/errors";
import { Operation } from "../../src/entities/OperationLog";
import CreateExternalCache from "../../src/usecases/CreateExternalCache";
import { getMockDependencies } from "../testUtils";

describe("usecase CreateExternalCache", () => {
    it("throws ExternalCacheConfigurationNotValidError if the configuration is not valid", async () => {
        const createExternalCache = new CreateExternalCache(
            getMockDependencies()
        );
        const createExternalCachePromise = createExternalCache.exec({
            domain: "domain.com",
            type: "type",
            configuration: "not-valid-configuration" as any
        });
        await expect(createExternalCachePromise).to.be.rejectedWith(
            ExternalCacheConfigurationNotValidError
        );
        await expect(createExternalCachePromise).to.be.rejectedWith(
            "Invalid external cache configuration object"
        );
    });

    it("throws ExternalCacheDomainNotValidError if the name is not valid", async () => {
        const createExternalCache = new CreateExternalCache(
            getMockDependencies()
        );
        const createExternalCachePromise = createExternalCache.exec({
            domain: "https://domain.com",
            type: "type",
            configuration: {}
        });
        await expect(createExternalCachePromise).to.be.rejectedWith(
            ExternalCacheDomainNotValidError
        );
        await expect(createExternalCachePromise).to.be.rejectedWith(
            "https://domain.com is not a valid domain name"
        );
    });

    it("throws ConflictingExternalCacheError if an externalCache with the same domain exists", async () => {
        const deps = getMockDependencies();
        deps.storages.externalCaches.oneExistsWithDomain.resolves(true);
        const createExternalCache = new CreateExternalCache(deps);
        const createExternalCachePromise = createExternalCache.exec({
            domain: "domain.com",
            type: "type",
            configuration: {}
        });
        await expect(createExternalCachePromise).to.be.rejectedWith(
            ConflictingExternalCacheError
        );
        await expect(createExternalCachePromise).to.be.rejectedWith(
            "An external cache with domain = domain.com already exists"
        );
    });

    it("creates an externalCache", async () => {
        const deps = getMockDependencies();
        const createExternalCache = new CreateExternalCache(deps);
        await createExternalCache.exec({
            domain: "domain.com",
            type: "type",
            configuration: {}
        });
        expect(
            deps.storages.externalCaches.createOne
        ).to.have.been.calledOnceWith({
            id: sinon.match.string,
            domain: "domain.com",
            type: "type",
            configuration: {},
            createdAt: sinon.match.date,
            updatedAt: sinon.match.date
        });
    });

    it("logs the create externalCache operation", async () => {
        const deps = getMockDependencies();
        const createExternalCache = new CreateExternalCache(deps);
        await createExternalCache.exec({
            domain: "domain.com",
            type: "type",
            configuration: {}
        });
        expect(
            deps.storages.operationLogs.createOne
        ).to.have.been.calledOnceWith(
            sinon.match.has("operation", Operation.CreateExternalCache)
        );
    });

    it("returns the created externalCache", async () => {
        const deps = getMockDependencies();
        const mockCreatedExternalCache = {} as any;
        deps.storages.externalCaches.createOne.resolves(
            mockCreatedExternalCache
        );
        const createExternalCache = new CreateExternalCache(deps);
        const createdExternalCache = await createExternalCache.exec({
            domain: "domain.com",
            type: "type",
            configuration: {}
        });
        expect(createdExternalCache).to.equal(mockCreatedExternalCache);
    });
});
