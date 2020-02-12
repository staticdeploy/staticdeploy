import { expect } from "chai";
import sinon from "sinon";

import {
    ConflictingGroupError,
    RoleNotValidError
} from "../../src/common/functionalErrors";
import { Operation } from "../../src/entities/OperationLog";
import CreateGroup from "../../src/usecases/CreateGroup";
import { getMockDependencies } from "../testUtils";

describe("usecase CreateGroup", () => {
    it("throws RoleNotValidError if one of the roles is not valid", async () => {
        const createGroup = new CreateGroup(getMockDependencies());
        const createGroupPromise = createGroup.exec({
            name: "name",
            roles: ["not-valid"]
        });
        await expect(createGroupPromise).to.be.rejectedWith(RoleNotValidError);
        await expect(createGroupPromise).to.be.rejectedWith(
            "not-valid is not a valid role"
        );
    });

    it("throws ConflictingGroupError if a group with the same name exists", async () => {
        const deps = getMockDependencies();
        deps.storages.groups.oneExistsWithName.resolves(true);
        const createGroup = new CreateGroup(deps);
        const createGroupPromise = createGroup.exec({
            name: "name",
            roles: []
        });
        await expect(createGroupPromise).to.be.rejectedWith(
            ConflictingGroupError
        );
        await expect(createGroupPromise).to.be.rejectedWith(
            "A group with name = name already exists"
        );
    });

    it("creates a group", async () => {
        const deps = getMockDependencies();
        const createGroup = new CreateGroup(deps);
        await createGroup.exec({ name: "name", roles: ["root"] });
        expect(deps.storages.groups.createOne).to.have.been.calledOnceWith({
            id: sinon.match.string,
            name: "name",
            roles: ["root"],
            createdAt: sinon.match.date,
            updatedAt: sinon.match.date
        });
    });

    it("logs the create group operation", async () => {
        const deps = getMockDependencies();
        const createGroup = new CreateGroup(deps);
        await createGroup.exec({ name: "name", roles: [] });
        expect(
            deps.storages.operationLogs.createOne
        ).to.have.been.calledOnceWith(
            sinon.match.has("operation", Operation.CreateGroup)
        );
    });

    it("returns the created group", async () => {
        const deps = getMockDependencies();
        const mockCreatedGroup = {} as any;
        deps.storages.groups.createOne.resolves(mockCreatedGroup);
        const createGroup = new CreateGroup(deps);
        const createdGroup = await createGroup.exec({
            name: "name",
            roles: []
        });
        expect(createdGroup).to.equal(mockCreatedGroup);
    });
});
