import { expect } from "chai";

import { AuthenticationRequiredError } from "../../src/common/errors";
import GetBundles from "../../src/usecases/GetBundles";
import { getMockDependencies } from "../testUtils";

describe("usecase GetBundles", () => {
    it("throws AuthenticationRequiredError if the request is not authenticated", async () => {
        const deps = getMockDependencies();
        deps.requestContext.userId = null;
        const getBundles = new GetBundles(deps);
        const getBundlesPromise = getBundles.exec();
        await expect(getBundlesPromise).to.be.rejectedWith(
            AuthenticationRequiredError
        );
        await expect(getBundlesPromise).to.be.rejectedWith(
            "This operation requires the request to be authenticated"
        );
    });

    it("returns the bundles found with the specified search filters (none for now)", async () => {
        const deps = getMockDependencies();
        const mockBundles = [] as any;
        deps.storages.bundles.findMany.resolves(mockBundles);
        const getBundles = new GetBundles(deps);
        const bundles = await getBundles.exec();
        expect(bundles).to.equal(mockBundles);
    });
});
