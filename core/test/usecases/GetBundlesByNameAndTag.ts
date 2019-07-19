import { expect } from "chai";

import { AuthenticationRequiredError } from "../../src/common/errors";
import GetBundlesByNameAndTag from "../../src/usecases/GetBundlesByNameAndTag";
import { getMockDependencies } from "../testUtils";

describe("usecase GetBundlesByNameAndTag", () => {
    it("throws AuthenticationRequiredError if the request is not authenticated", async () => {
        const deps = getMockDependencies();
        deps.requestContext.userId = null;
        const getBundles = new GetBundlesByNameAndTag(deps);
        const getBundlesPromise = getBundles.exec("name", "tag");
        await expect(getBundlesPromise).to.be.rejectedWith(
            AuthenticationRequiredError
        );
        await expect(getBundlesPromise).to.be.rejectedWith(
            "This operation requires the request to be authenticated"
        );
    });

    it("returns the bundles found with the specified name:tag combination", async () => {
        const deps = getMockDependencies();
        const mockBundles = [] as any;
        deps.storages.bundles.findManyByNameAndTag.resolves(mockBundles);
        const getBundles = new GetBundlesByNameAndTag(deps);
        const bundles = await getBundles.exec("name", "tag");
        expect(bundles).to.equal(mockBundles);
    });
});
