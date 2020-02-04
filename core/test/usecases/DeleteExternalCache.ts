import { expect } from "chai";
import sinon from "sinon";

import { ExternalCacheNotFoundError } from "../../src/common/errors";
import { Operation } from "../../src/entities/OperationLog";
import DeleteExternalCache from "../../src/usecases/DeleteExternalCache";
import { getMockDependencies } from "../testUtils";

describe("usecase DeleteExternalCache", () => {
    it("throws ExternalCacheNotFoundError if no externalCache with the specified id exists", async () => {
        const deleteExternalCache = new DeleteExternalCache(
            getMockDependencies()
        );
        const deleteExternalCachePromise = deleteExternalCache.exec(
            "externalCacheId"
        );
        await expect(deleteExternalCachePromise).to.be.rejectedWith(
            ExternalCacheNotFoundError
        );
        await expect(deleteExternalCachePromise).to.be.rejectedWith(
            "No external cache found with id = externalCacheId"
        );
    });

    it("deletes the externalCache", async () => {
        const deps = getMockDependencies();
        deps.storages.externalCaches.findOne.resolves({} as any);
        const deleteExternalCache = new DeleteExternalCache(deps);
        await deleteExternalCache.exec("externalCacheId");
        expect(
            deps.storages.externalCaches.deleteOne
        ).to.have.been.calledOnceWith("externalCacheId");
    });

    it("logs the delete externalCache operation", async () => {
        const deps = getMockDependencies();
        deps.storages.externalCaches.findOne.resolves({} as any);
        const deleteExternalCache = new DeleteExternalCache(deps);
        await deleteExternalCache.exec("externalCacheId");
        expect(
            deps.storages.operationLogs.createOne
        ).to.have.been.calledOnceWith(
            sinon.match.has("operation", Operation.DeleteExternalCache)
        );
    });
});
