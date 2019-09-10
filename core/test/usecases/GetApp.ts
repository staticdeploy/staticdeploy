import { expect } from "chai";

import { AppNotFoundError } from "../../src/common/errors";
import GetApp from "../../src/usecases/GetApp";
import { getMockDependencies } from "../testUtils";

describe("usecase GetApp", () => {
    it("throws AppNotFoundError if an app with the specified id doesn't exist", async () => {
        const getApp = new GetApp(getMockDependencies());
        const getAppPromise = getApp.exec("appId");
        await expect(getAppPromise).to.be.rejectedWith(AppNotFoundError);
        await expect(getAppPromise).to.be.rejectedWith(
            "No app found with id = appId"
        );
    });

    it("returns the app with the specified id", async () => {
        const deps = getMockDependencies();
        const mockApp = {} as any;
        deps.storages.apps.findOne.resolves(mockApp);
        const getApp = new GetApp(deps);
        const app = await getApp.exec("appId");
        expect(app).to.equal(mockApp);
    });
});
