import { expect } from "chai";

import {
    AuthenticationRequiredError,
    BundleNameTagCombinationNotValidError
} from "../../src/common/errors";
import GetBundlesByNameTagCombination from "../../src/usecases/GetBundlesByNameTagCombination";
import { getMockDependencies } from "../testUtils";

describe("usecase GetBundlesByNameTagCombination", () => {
    it("throws AuthenticationRequiredError if the request is not authenticated", async () => {
        const deps = getMockDependencies();
        deps.requestContext.userId = null;
        const getBundles = new GetBundlesByNameTagCombination(deps);
        const getBundlesPromise = getBundles.exec("name:tag");
        await expect(getBundlesPromise).to.be.rejectedWith(
            AuthenticationRequiredError
        );
        await expect(getBundlesPromise).to.be.rejectedWith(
            "This operation requires the request to be authenticated"
        );
    });

    it("throws BundleNameTagCombinationNotValidError if the name:tag combination is not valid", async () => {
        const getBundles = new GetBundlesByNameTagCombination(
            getMockDependencies()
        );
        const getBundlesPromise = getBundles.exec("*");
        await expect(getBundlesPromise).to.be.rejectedWith(
            BundleNameTagCombinationNotValidError
        );
        await expect(getBundlesPromise).to.be.rejectedWith(
            "* is not a valid name:tag combination for a bundle"
        );
    });

    it("returns the bundles found with the specified name:tag combination", async () => {
        const deps = getMockDependencies();
        const mockBundles = [] as any;
        deps.bundlesStorage.findManyByNameAndTag.resolves(mockBundles);
        const getBundles = new GetBundlesByNameTagCombination(deps);
        const bundles = await getBundles.exec("name:tag");
        expect(bundles).to.equal(mockBundles);
    });
});
