import { expect } from "chai";
import sinon from "sinon";

import {
    AppHasEntrypointsError,
    AppNotFoundError
} from "../../src/common/errors";
import { Operation } from "../../src/entities/OperationLog";
import DeleteApp from "../../src/usecases/DeleteApp";
import { getMockDependencies } from "../testUtils";

describe("usecase DeleteApp", () => {
    it("throws AppNotFoundError if no app with the specified id exists", async () => {
        const deleteApp = new DeleteApp(getMockDependencies());
        const deleteAppPromise = deleteApp.exec("appId");
        await expect(deleteAppPromise).to.be.rejectedWith(AppNotFoundError);
        await expect(deleteAppPromise).to.be.rejectedWith(
            "No app found with id = appId"
        );
    });

    it("throws AppHasEntrypointsError if the app has linked entrypoints", async () => {
        const deps = getMockDependencies();
        deps.storages.apps.findOne.resolves({} as any);
        deps.storages.entrypoints.findManyByAppId.resolves([{}] as any);
        const deleteApp = new DeleteApp(deps);
        const deleteAppPromise = deleteApp.exec("appId");
        await expect(deleteAppPromise).to.be.rejectedWith(
            AppHasEntrypointsError
        );
        await expect(deleteAppPromise).to.be.rejectedWith(
            "Can't delete app with id = appId because it has linked entrypoints"
        );
    });

    it("deletes the app", async () => {
        const deps = getMockDependencies();
        deps.storages.apps.findOne.resolves({} as any);
        const deleteApp = new DeleteApp(deps);
        await deleteApp.exec("appId");
        expect(deps.storages.apps.deleteOne).to.have.been.calledOnceWith(
            "appId"
        );
    });

    it("logs the delete app operation", async () => {
        const deps = getMockDependencies();
        deps.storages.apps.findOne.resolves({} as any);
        const deleteApp = new DeleteApp(deps);
        await deleteApp.exec("appId");
        expect(
            deps.storages.operationLogs.createOne
        ).to.have.been.calledOnceWith(
            sinon.match.has("operation", Operation.DeleteApp)
        );
    });
});
