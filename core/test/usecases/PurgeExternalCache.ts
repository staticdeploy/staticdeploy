import { expect } from "chai";
import sinon, { SinonStub } from "sinon";

import {
    ExternalCacheNotFoundError,
    ExternalCacheTypeNotSupportedError
} from "../../src/common/functionalErrors";
import IExternalCacheService from "../../src/dependencies/IExternalCacheService";
import { IExternalCacheType } from "../../src/entities/ExternalCache";
import { Operation } from "../../src/entities/OperationLog";
import PurgeExternalCache from "../../src/usecases/PurgeExternalCache";
import { getMockDependencies } from "../testUtils";

describe("usecase PurgeExternalCache", () => {
    const getMockExternalCacheService = (
        type: string
    ): {
        externalCacheType: IExternalCacheType;
        purge: SinonStub<
            Parameters<IExternalCacheService["purge"]>,
            ReturnType<IExternalCacheService["purge"]>
        >;
    } => ({
        externalCacheType: {
            name: type,
            label: "label",
            configurationFields: []
        },
        purge: sinon.stub()
    });

    it("throws ExternalCacheNotFoundError if no externalCache with the specified id exists", async () => {
        const purgeExternalCache = new PurgeExternalCache(
            getMockDependencies()
        );
        const purgeExternalCachePromise = purgeExternalCache.exec(
            "externalCacheId",
            []
        );
        await expect(purgeExternalCachePromise).to.be.rejectedWith(
            ExternalCacheNotFoundError
        );
        await expect(purgeExternalCachePromise).to.be.rejectedWith(
            "No external cache found with id = externalCacheId"
        );
    });

    describe("throws ExternalCacheTypeNotSupportedError if no external cache service matches the specified external cache's type", async () => {
        it("case: no external cache services", async () => {
            const deps = getMockDependencies();
            deps.storages.externalCaches.findOne.resolves({
                type: "type"
            } as any);
            const purgeExternalCache = new PurgeExternalCache(deps);
            const purgeExternalCachePromise = purgeExternalCache.exec(
                "externalCacheId",
                []
            );
            await expect(purgeExternalCachePromise).to.be.rejectedWith(
                ExternalCacheTypeNotSupportedError
            );
            await expect(purgeExternalCachePromise).to.be.rejectedWith(
                "type is not a supported external cache type"
            );
        });
        it("case: multiple external cache services", async () => {
            const deps = getMockDependencies();
            deps.externalCacheServices.push(
                getMockExternalCacheService("type0")
            );
            deps.externalCacheServices.push(
                getMockExternalCacheService("type1")
            );
            deps.storages.externalCaches.findOne.resolves({
                type: "type2"
            } as any);
            const purgeExternalCache = new PurgeExternalCache(deps);
            const purgeExternalCachePromise = purgeExternalCache.exec(
                "externalCacheId",
                []
            );
            await expect(purgeExternalCachePromise).to.be.rejectedWith(
                ExternalCacheTypeNotSupportedError
            );
            await expect(purgeExternalCachePromise).to.be.rejectedWith(
                "type2 is not a supported external cache type"
            );
        });
    });

    it("purges the cache via the externalCacheService", async () => {
        const deps = getMockDependencies();
        const externalCacheService = getMockExternalCacheService("type");
        deps.externalCacheServices.push(externalCacheService);
        deps.storages.externalCaches.findOne.resolves({
            type: "type",
            configuration: {}
        } as any);
        const purgeExternalCache = new PurgeExternalCache(deps);
        await purgeExternalCache.exec("externalCacheId", ["/*"]);
        await expect(externalCacheService.purge).to.have.been.calledOnceWith(
            ["/*"],
            {}
        );
    });

    it("logs the purge externalCache operation", async () => {
        const deps = getMockDependencies();
        deps.externalCacheServices.push(getMockExternalCacheService("type"));
        deps.storages.externalCaches.findOne.resolves({
            type: "type",
            configuration: {}
        } as any);
        const purgeExternalCache = new PurgeExternalCache(deps);
        await purgeExternalCache.exec("externalCacheId", ["/*"]);
        expect(
            deps.storages.operationLogs.createOne
        ).to.have.been.calledOnceWith(
            sinon.match.has("operation", Operation.PurgeExternalCache)
        );
    });
});
