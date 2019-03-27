import { expect } from "chai";
import sinon from "sinon";

import {
    AppNameNotValidError,
    AuthenticationRequiredError,
    ConfigurationNotValidError,
    ConflictingAppError
} from "../../src/common/errors";
import { Operation } from "../../src/entities/OperationLog";
import CreateApp from "../../src/usecases/CreateApp";
import { getMockDependencies } from "../testUtils";

describe("usecase CreateApp", () => {
    it("throws AuthenticationRequiredError if the request is not authenticated", async () => {
        const deps = getMockDependencies();
        deps.requestContext.userId = null;
        const createApp = new CreateApp(deps);
        const createAppPromise = createApp.exec({ name: "name" });
        await expect(createAppPromise).to.be.rejectedWith(
            AuthenticationRequiredError
        );
        await expect(createAppPromise).to.be.rejectedWith(
            "This operation requires the request to be authenticated"
        );
    });

    it("throws AppNameNotValidError if the name is not valid", async () => {
        const createApp = new CreateApp(getMockDependencies());
        const createAppPromise = createApp.exec({ name: "*" });
        await expect(createAppPromise).to.be.rejectedWith(AppNameNotValidError);
        await expect(createAppPromise).to.be.rejectedWith(
            "* is not a valid name for an app"
        );
    });

    it("throws ConfigurationNotValidError if the defaultConfiguration is not valid", async () => {
        const createApp = new CreateApp(getMockDependencies());
        const createAppPromise = createApp.exec({
            name: "name",
            defaultConfiguration: "not-valid-configuration" as any
        });
        await expect(createAppPromise).to.be.rejectedWith(
            ConfigurationNotValidError
        );
        await expect(createAppPromise).to.be.rejectedWith(
            "defaultConfiguration is not a valid configuration object"
        );
    });

    it("throws ConflictingAppError if an app with the same name exists", async () => {
        const deps = getMockDependencies();
        deps.appsStorage.findOneByName.resolves({} as any);
        const createApp = new CreateApp(deps);
        const createAppPromise = createApp.exec({ name: "name" });
        await expect(createAppPromise).to.be.rejectedWith(ConflictingAppError);
        await expect(createAppPromise).to.be.rejectedWith(
            "An app with name = name already exists"
        );
    });

    it("creates an app", async () => {
        const deps = getMockDependencies();
        const createApp = new CreateApp(deps);
        await createApp.exec({ name: "name" });
        expect(deps.appsStorage.createOne).to.have.been.calledOnceWith({
            id: sinon.match.string,
            name: "name",
            defaultConfiguration: {},
            createdAt: sinon.match.date,
            updatedAt: sinon.match.date
        });
    });

    it("logs the create app operation", async () => {
        const deps = getMockDependencies();
        const createApp = new CreateApp(deps);
        await createApp.exec({ name: "name" });
        expect(deps.operationLogsStorage.createOne).to.have.been.calledOnceWith(
            sinon.match.has("operation", Operation.createApp)
        );
    });

    it("returns the created app", async () => {
        const deps = getMockDependencies();
        const mockCreatedApp = {} as any;
        deps.appsStorage.createOne.resolves(mockCreatedApp);
        const createApp = new CreateApp(deps);
        const createdApp = await createApp.exec({ name: "name" });
        expect(createdApp).to.equal(mockCreatedApp);
    });
});
