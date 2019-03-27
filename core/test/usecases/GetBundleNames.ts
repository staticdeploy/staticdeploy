import { expect } from "chai";

import { AuthenticationRequiredError } from "../../src/common/errors";
import GetBundleNames from "../../src/usecases/GetBundleNames";
import { getMockDependencies } from "../testUtils";

describe("usecase GetBundleNames", () => {
    it("throws AuthenticationRequiredError if the request is not authenticated", async () => {
        const deps = getMockDependencies();
        deps.requestContext.userId = null;
        const getBundleNames = new GetBundleNames(deps);
        const getBundleNamesPromise = getBundleNames.exec();
        await expect(getBundleNamesPromise).to.be.rejectedWith(
            AuthenticationRequiredError
        );
        await expect(getBundleNamesPromise).to.be.rejectedWith(
            "This operation requires the request to be authenticated"
        );
    });

    it("returns all the (unique) names of the stored bundles", async () => {
        const deps = getMockDependencies();
        const mockBundleNames = [] as any;
        deps.bundlesStorage.findManyBundleNames.resolves(mockBundleNames);
        const getBundleNames = new GetBundleNames(deps);
        const bundleNames = await getBundleNames.exec();
        expect(bundleNames).to.equal(mockBundleNames);
    });
});
