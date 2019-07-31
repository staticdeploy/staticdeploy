import { expect } from "chai";

import GetApps from "../../src/usecases/GetApps";
import { getMockDependencies } from "../testUtils";

describe("usecase GetApps", () => {
    it("returns the apps found with the specified search filters (none for now)", async () => {
        const deps = getMockDependencies();
        const mockApps = [] as any;
        deps.storages.apps.findMany.resolves(mockApps);
        const getApps = new GetApps(deps);
        const apps = await getApps.exec();
        expect(apps).to.equal(mockApps);
    });
});
