import { expect } from "chai";

import GetBundlesByNameAndTag from "../../src/usecases/GetBundlesByNameAndTag";
import { getMockDependencies } from "../testUtils";

describe("usecase GetBundlesByNameAndTag", () => {
    it("returns the bundles found with the specified name:tag combination", async () => {
        const deps = getMockDependencies();
        const mockBundles = [] as any;
        deps.storages.bundles.findManyByNameAndTag.resolves(mockBundles);
        const getBundles = new GetBundlesByNameAndTag(deps);
        const bundles = await getBundles.exec("name", "tag");
        expect(bundles).to.equal(mockBundles);
    });
});
