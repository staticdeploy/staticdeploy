import { expect } from "chai";

import { BundleNotFoundError } from "../../src/common/functionalErrors";
import GetBundle from "../../src/usecases/GetBundle";
import { getMockDependencies } from "../testUtils";

describe("usecase GetBundle", () => {
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
