import { expect } from "chai";
import sinon from "sinon";

import { BundlesInUseError } from "../../src/common/errors";
import { Operation } from "../../src/entities/OperationLog";
import DeleteBundlesByNameAndTag from "../../src/usecases/DeleteBundlesByNameAndTag";
import { getMockDependencies } from "../testUtils";

describe("usecase DeleteBundlesByNameAndTag", () => {
    it("throws BundlesInUseError if one of the to-be-delete bundles is being use by some entrypoint", async () => {
        const deps = getMockDependencies();
        deps.storages.bundles.findManyByNameAndTag.resolves([
            { id: "bundleId" } as any
        ]);
        deps.storages.entrypoints.findManyByBundleIds.resolves([
            { id: "entrypointId" } as any
        ]);
        const deleteBundles = new DeleteBundlesByNameAndTag(deps);
        const deleteBundlesPromise = deleteBundles.exec("name", "tag");
        await expect(deleteBundlesPromise).to.be.rejectedWith(
            BundlesInUseError
        );
        await expect(deleteBundlesPromise).to.be.rejectedWith(
            "Can't delete bundles with id = bundleId, as one or more of them are being used by entrypoints with ids = entrypointId"
        );
    });

    it("deletes the bundles", async () => {
        const deps = getMockDependencies();
        deps.storages.bundles.findManyByNameAndTag.resolves([
            { id: "bundleId" } as any
        ]);
        const deleteBundles = new DeleteBundlesByNameAndTag(deps);
        await deleteBundles.exec("name", "tag");
        expect(deps.storages.bundles.deleteMany).to.have.been.calledOnceWith([
            "bundleId"
        ]);
    });

    it("logs the delete bundles operation", async () => {
        const deps = getMockDependencies();
        deps.storages.bundles.findManyByNameAndTag.resolves([
            { id: "bundleId" } as any
        ]);
        const deleteBundles = new DeleteBundlesByNameAndTag(deps);
        await deleteBundles.exec("name", "tag");
        expect(
            deps.storages.operationLogs.createOne
        ).to.have.been.calledOnceWith(
            sinon.match.has("operation", Operation.deleteBundle)
        );
    });
});
