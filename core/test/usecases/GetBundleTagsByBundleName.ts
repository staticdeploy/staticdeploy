import { expect } from "chai";

import { AuthenticationRequiredError } from "../../src/common/errors";
import GetBundleTagsByBundleName from "../../src/usecases/GetBundleTagsByBundleName";
import { getMockDependencies } from "../testUtils";

describe("usecase GetBundleTagsByBundleName", () => {
    it("throws AuthenticationRequiredError if the request is not authenticated", async () => {
        const deps = getMockDependencies();
        deps.requestContext.userId = null;
        const getBundleTags = new GetBundleTagsByBundleName(deps);
        const getBundleTagsPromise = getBundleTags.exec("name");
        await expect(getBundleTagsPromise).to.be.rejectedWith(
            AuthenticationRequiredError
        );
        await expect(getBundleTagsPromise).to.be.rejectedWith(
            "This operation requires the request to be authenticated"
        );
    });

    it("returns all the (unique) tags of the stored bundles by the specified name", async () => {
        const deps = getMockDependencies();
        const mockBundleTags = [] as any;
        deps.storages.bundles.findManyTagsByName.resolves(mockBundleTags);
        const getBundleTags = new GetBundleTagsByBundleName(deps);
        const bundleTags = await getBundleTags.exec("name");
        expect(bundleTags).to.equal(mockBundleTags);
    });
});
