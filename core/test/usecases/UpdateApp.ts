import { expect } from "chai";
import sinon from "sinon";

import {
    AppNameNotValidError,
    AppNotFoundError,
    ConfigurationNotValidError,
    ConflictingAppError
} from "../../src/common/errors";
import { Operation } from "../../src/entities/OperationLog";
import UpdateApp from "../../src/usecases/UpdateApp";
import { getMockDependencies } from "../testUtils";

describe("usecase UpdateApp", () => {
    it("throws AppNameNotValidError if the name is not valid", async () => {
        const updateApp = new UpdateApp(getMockDependencies());
        const updateAppPromise = updateApp.exec("appId", { name: "*" });
        await expect(updateAppPromise).to.be.rejectedWith(AppNameNotValidError);
        await expect(updateAppPromise).to.be.rejectedWith(
            "* is not a valid name for an app"
        );
    });

    it("throws ConfigurationNotValidError if the defaultConfiguration is not valid", async () => {
        const updateApp = new UpdateApp(getMockDependencies());
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

    it("throws AppNotFoundError if no app with the specified id exists", async () => {
        const updateApp = new UpdateApp(getMockDependencies());
        const updateAppPromise = updateApp.exec("appId", {});
        await expect(updateAppPromise).to.be.rejectedWith(AppNotFoundError);
        await expect(updateAppPromise).to.be.rejectedWith(
            "No app found with id = appId"
        );
    });

    it("throws ConflictingAppError if an app with the same (to be updated) name exists", async () => {
        const deps = getMockDependencies();
        deps.storages.apps.findOne.resolves({} as any);
        deps.storages.apps.findOneByName.resolves({} as any);
        const updateApp = new UpdateApp(deps);
        const updateAppPromise = updateApp.exec("appId", { name: "name" });
        await expect(updateAppPromise).to.be.rejectedWith(ConflictingAppError);
        await expect(updateAppPromise).to.be.rejectedWith(
            "An app with name = name already exists"
        );
    });

    it("updates the app", async () => {
        const deps = getMockDependencies();
        deps.storages.apps.findOne.resolves({} as any);
        const updateApp = new UpdateApp(deps);
        await updateApp.exec("appId", { name: "name" });
        expect(deps.storages.apps.updateOne).to.have.been.calledOnceWith(
            "appId",
            {
                name: "name",
                defaultConfiguration: undefined,
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
