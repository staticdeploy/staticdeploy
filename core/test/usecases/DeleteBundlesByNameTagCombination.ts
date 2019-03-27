import { expect } from "chai";
import sinon from "sinon";

import {
    AuthenticationRequiredError,
    BundleNameTagCombinationNotValidError,
    BundlesInUseError
} from "../../src/common/errors";
import { Operation } from "../../src/entities/OperationLog";
import DeleteBundlesByNameTagCombination from "../../src/usecases/DeleteBundlesByNameTagCombination";
import { getMockDependencies } from "../testUtils";

describe("usecase DeleteBundlesByNameTagCombination", () => {
    it("throws AuthenticationRequiredError if the request is not authenticated", async () => {
        const deps = getMockDependencies();
        deps.requestContext.userId = null;
        const deleteBundles = new DeleteBundlesByNameTagCombination(deps);
        const deleteBundlesPromise = deleteBundles.exec("name:tag");
        await expect(deleteBundlesPromise).to.be.rejectedWith(
            AuthenticationRequiredError
        );
        await expect(deleteBundlesPromise).to.be.rejectedWith(
            "This operation requires the request to be authenticated"
        );
    });

    it("throws BundleNameTagCombinationNotValidError if the name:tag combination is not valid", async () => {
        const deleteBundles = new DeleteBundlesByNameTagCombination(
            getMockDependencies()
        );
        const deleteBundlesPromise = deleteBundles.exec("*");
        await expect(deleteBundlesPromise).to.be.rejectedWith(
            BundleNameTagCombinationNotValidError
        );
        await expect(deleteBundlesPromise).to.be.rejectedWith(
            "* is not a valid name:tag combination for a bundle"
        );
    });

    it("throws BundlesInUseError if one of the to-be-delete bundles is being use by some entrypoint", async () => {
        const deps = getMockDependencies();
        deps.entrypointsStorage.findManyByBundleIds.resolves([
            { id: "entrypointId" } as any
        ]);
        const deleteBundles = new DeleteBundlesByNameTagCombination(deps);
        const deleteBundlesPromise = deleteBundles.exec("name:tag");
        await expect(deleteBundlesPromise).to.be.rejectedWith(
            BundlesInUseError
        );
        await expect(deleteBundlesPromise).to.be.rejectedWith(
            "Can't delete bundles with id = , as ore or more of them are being used by entrypoints with ids = entrypointId"
        );
    });

    it("deletes the bundles", async () => {
        const deps = getMockDependencies();
        deps.bundlesStorage.findManyByNameAndTag.resolves([
            { id: "bundleId" } as any
        ]);
        const deleteBundles = new DeleteBundlesByNameTagCombination(deps);
        await deleteBundles.exec("name:tag");
        expect(deps.bundlesStorage.deleteMany).to.have.been.calledOnceWith([
            "bundleId"
        ]);
    });

    it("logs the delete bundles operation", async () => {
        const deps = getMockDependencies();
        deps.bundlesStorage.findManyByNameAndTag.resolves([
            { id: "bundleId" } as any
        ]);
        const deleteBundles = new DeleteBundlesByNameTagCombination(deps);
        await deleteBundles.exec("name:tag");
        expect(deps.operationLogsStorage.createOne).to.have.been.calledOnceWith(
            sinon.match.has("operation", Operation.deleteBundle)
        );
    });
});
