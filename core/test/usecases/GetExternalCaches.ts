import { expect } from "chai";

import GetExternalCaches from "../../src/usecases/GetExternalCaches";
import { getMockDependencies } from "../testUtils";

describe("usecase GetExternalCaches", () => {
    it("returns the externalCaches found with the specified search filters (none for now)", async () => {
        const deps = getMockDependencies();
        const mockExternalCaches = [] as any;
        deps.storages.externalCaches.findMany.resolves(mockExternalCaches);
        const getExternalCaches = new GetExternalCaches(deps);
        const externalCaches = await getExternalCaches.exec();
        expect(externalCaches).to.equal(mockExternalCaches);
    });
});
