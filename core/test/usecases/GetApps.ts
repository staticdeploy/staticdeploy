import { expect } from "chai";

import { AuthenticationRequiredError } from "../../src/common/errors";
import GetApps from "../../src/usecases/GetApps";
import { getMockDependencies } from "../testUtils";

describe("usecase GetApps", () => {
    it("throws AuthenticationRequiredError if the request is not authenticated", async () => {
        const deps = getMockDependencies();
        deps.requestContext.userId = null;
        const getApps = new GetApps(deps);
        const getAppsPromise = getApps.exec();
        await expect(getAppsPromise).to.be.rejectedWith(
            AuthenticationRequiredError
        );
        await expect(getAppsPromise).to.be.rejectedWith(
            "This operation requires the request to be authenticated"
        );
    });

    it("returns the apps found with the specified search filters (none for now)", async () => {
        const deps = getMockDependencies();
        const mockApps = [] as any;
        deps.storages.apps.findMany.resolves(mockApps);
        const getApps = new GetApps(deps);
        const apps = await getApps.exec();
        expect(apps).to.equal(mockApps);
    });
});
