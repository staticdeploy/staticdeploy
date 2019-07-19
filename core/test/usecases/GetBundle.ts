import { expect } from "chai";

import {
    AuthenticationRequiredError,
    BundleNotFoundError
} from "../../src/common/errors";
import GetBundle from "../../src/usecases/GetBundle";
import { getMockDependencies } from "../testUtils";

describe("usecase GetBundle", () => {
    it("throws AuthenticationRequiredError if the request is not authenticated", async () => {
        const deps = getMockDependencies();
        deps.requestContext.userId = null;
        const getBundle = new GetBundle(deps);
        const getBundlePromise = getBundle.exec("bundleId");
        await expect(getBundlePromise).to.be.rejectedWith(
            AuthenticationRequiredError
        );
        await expect(getBundlePromise).to.be.rejectedWith(
            "This operation requires the request to be authenticated"
        );
    });

    it("throws BundleNotFoundError if a bundle with the specified id doesn't exist", async () => {
        const getBundle = new GetBundle(getMockDependencies());
        const getBundlePromise = getBundle.exec("bundleId");
        await expect(getBundlePromise).to.be.rejectedWith(BundleNotFoundError);
        await expect(getBundlePromise).to.be.rejectedWith(
            "No bundle found with id = bundleId"
        );
    });

    it("returns the bundle with the specified id", async () => {
        const deps = getMockDependencies();
        const mockBundle = {
            id: "id",
            name: "name",
            tag: "tag",
            createdAt: "createdAt"
        } as any;
        deps.storages.bundles.findOne.resolves(mockBundle);
        const getBundle = new GetBundle(deps);
        const bundle = await getBundle.exec("bundleId");
        expect(bundle).to.deep.equal(mockBundle);
    });
});
