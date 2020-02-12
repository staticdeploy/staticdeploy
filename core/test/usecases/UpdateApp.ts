import { expect } from "chai";
import sinon from "sinon";

import {
    AppNotFoundError,
    ConfigurationNotValidError
} from "../../src/common/functionalErrors";
import { Operation } from "../../src/entities/OperationLog";
import UpdateApp from "../../src/usecases/UpdateApp";
import { getMockDependencies } from "../testUtils";

describe("usecase UpdateApp", () => {
    it("throws AppNotFoundError if no app with the specified id exists", async () => {
        const updateApp = new UpdateApp(getMockDependencies());
        const updateAppPromise = updateApp.exec("appId", {});
        await expect(updateAppPromise).to.be.rejectedWith(AppNotFoundError);
        await expect(updateAppPromise).to.be.rejectedWith(
            "No app found with id = appId"
        );
    });

    it("throws ConfigurationNotValidError if the defaultConfiguration is not valid", async () => {
        const deps = getMockDependencies();
        deps.storages.apps.findOne.resolves({} as any);
        const updateApp = new UpdateApp(deps);
        const updateAppPromise = updateApp.exec("appId", {
            defaultConfiguration: "not-valid-configuration" as any
        });
        await expect(updateAppPromise).to.be.rejectedWith(
            ConfigurationNotValidError
        );
        await expect(updateAppPromise).to.be.rejectedWith(
            "defaultConfiguration is not a valid configuration object"
        );
    });

    it("updates the app", async () => {
        const deps = getMockDependencies();
        deps.storages.apps.findOne.resolves({} as any);
        const updateApp = new UpdateApp(deps);
        await updateApp.exec("appId", { defaultConfiguration: {} });
        expect(deps.storages.apps.updateOne).to.have.been.calledOnceWith(
            "appId",
            {
                defaultConfiguration: {},
                updatedAt: sinon.match.date
            }
        );
    });

    it("logs the update app operation", async () => {
        const deps = getMockDependencies();
        deps.storages.apps.findOne.resolves({} as any);
        const updateApp = new UpdateApp(deps);
        await updateApp.exec("appId", {});
        expect(
            deps.storages.operationLogs.createOne
        ).to.have.been.calledOnceWith(
            sinon.match.has("operation", Operation.UpdateApp)
        );
    });

    it("returns the updated app", async () => {
        const deps = getMockDependencies();
        const mockUpdatedApp = {} as any;
        deps.storages.apps.findOne.resolves({} as any);
        deps.storages.apps.updateOne.resolves(mockUpdatedApp);
        const updateApp = new UpdateApp(deps);
        const updatedApp = await updateApp.exec("appId", {});
        expect(updatedApp).to.equal(mockUpdatedApp);
    });
});
