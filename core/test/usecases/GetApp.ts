import { expect } from "chai";

import {
    AppNotFoundError,
    AuthenticationRequiredError
} from "../../src/common/errors";
import GetApp from "../../src/usecases/GetApp";
import { getMockDependencies } from "../testUtils";

describe("usecase GetApp", () => {
    it("throws AuthenticationRequiredError if the request is not authenticated", async () => {
        const deps = getMockDependencies();
        deps.requestContext.userId = null;
        const getApp = new GetApp(deps);
        const getAppPromise = getApp.exec("appId");
        await expect(getAppPromise).to.be.rejectedWith(
            AuthenticationRequiredError
        );
        await expect(getAppPromise).to.be.rejectedWith(
            "This operation requires the request to be authenticated"
        );
    });

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
        deps.appsStorage.findOne.resolves(mockApp);
        const getApp = new GetApp(deps);
        const app = await getApp.exec("appId");
        expect(app).to.equal(mockApp);
    });
});
