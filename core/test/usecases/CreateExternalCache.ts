import { expect } from "chai";
import sinon, { SinonStub } from "sinon";

import {
    ConflictingExternalCacheError,
    ExternalCacheConfigurationNotValidError,
    ExternalCacheDomainNotValidError,
    ExternalCacheTypeNotSupportedError
} from "../../src/common/functionalErrors";
import IExternalCacheService from "../../src/dependencies/IExternalCacheService";
import { IExternalCacheType } from "../../src/entities/ExternalCache";
import { Operation } from "../../src/entities/OperationLog";
import CreateExternalCache from "../../src/usecases/CreateExternalCache";
import { getMockDependencies } from "../testUtils";

describe("usecase CreateExternalCache", () => {
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

    it("throws ExternalCacheTypeNotSupportedError if the type is not supported", async () => {
        const createExternalCache = new CreateExternalCache(
            getMockDependencies()
        );
        const createExternalCachePromise = createExternalCache.exec({
            domain: "domain.com",
            type: "type",
            configuration: {}
        });
        await expect(createExternalCachePromise).to.be.rejectedWith(
            ExternalCacheTypeNotSupportedError
        );
        await expect(createExternalCachePromise).to.be.rejectedWith(
            "type is not a supported external cache type"
        );
    });

    it("throws ExternalCacheDomainNotValidError if the name is not valid", async () => {
        const deps = getMockDependencies();
        deps.externalCacheServices.push(getMockExternalCacheService());
        const createExternalCache = new CreateExternalCache(deps);
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

    it("throws ExternalCacheConfigurationNotValidError if the configuration is not valid", async () => {
        const deps = getMockDependencies();
        deps.externalCacheServices.push(getMockExternalCacheService());
        const createExternalCache = new CreateExternalCache(deps);
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

    it("throws ConflictingExternalCacheError if an externalCache with the same domain exists", async () => {
        const deps = getMockDependencies();
        deps.externalCacheServices.push(getMockExternalCacheService());
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
        deps.externalCacheServices.push(getMockExternalCacheService());
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
        deps.externalCacheServices.push(getMockExternalCacheService());
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
        deps.externalCacheServices.push(getMockExternalCacheService());
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
