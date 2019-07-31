import { expect } from "chai";

import GetBundleTagsByBundleName from "../../src/usecases/GetBundleTagsByBundleName";
import { getMockDependencies } from "../testUtils";

describe("usecase GetBundleTagsByBundleName", () => {
    it("returns all the (unique) tags of the stored bundles by the specified name", async () => {
        const deps = getMockDependencies();
        const mockBundleTags = [] as any;
        deps.storages.bundles.findManyTagsByName.resolves(mockBundleTags);
        const getBundleTags = new GetBundleTagsByBundleName(deps);
        const bundleTags = await getBundleTags.exec("name");
        expect(bundleTags).to.equal(mockBundleTags);
    });
});
