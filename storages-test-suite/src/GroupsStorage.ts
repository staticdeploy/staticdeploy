import { IStorages } from "@staticdeploy/core";
import { expect } from "chai";

export default (storages: IStorages) => {
    describe("GroupsStorage", () => {
        it("create a group and verify that one group with its name exists", async () => {
            await storages.groups.createOne({
                id: "id",
                name: "name",
                roles: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            const groupExists = await storages.groups.oneExistsWithName("name");
            expect(groupExists).to.equal(true);
        });

        it("check if one group with a non-existing name exists and get false", async () => {
            const groupExists = await storages.groups.oneExistsWithName("name");
            expect(groupExists).to.equal(false);
        });

        it("create two groups and verify that all groups with their ids exist", async () => {
            await storages.groups.createOne({
                id: "id0",
                name: "name0",
                roles: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            await storages.groups.createOne({
                id: "id1",
                name: "name1",
                roles: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            const allGroupsExist = await storages.groups.allExistWithIds([
                "id0",
                "id1",
            ]);
            expect(allGroupsExist).to.equal(true);
        });

        it("create a group, check if all groups with its id and a non-existing id exist, and get false", async () => {
            await storages.groups.createOne({
                id: "id0",
                name: "name0",
                roles: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            const allGroupsExist = await storages.groups.allExistWithIds([
                "id0",
                "id1",
            ]);
            expect(allGroupsExist).to.equal(false);
        });

        it("create a group and find it by id", async () => {
            const group = {
                id: "id",
                name: "name",
                roles: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            await storages.groups.createOne(group);
            const foundGroup = await storages.groups.findOne("id");
            expect(foundGroup).to.deep.equal(group);
        });

        it("try to find a group by a non-existing id and get null", async () => {
            const notFoundGroup = await storages.groups.findOne("id");
            expect(notFoundGroup).to.equal(null);
        });

        it("create a group and find it by name", async () => {
            const group = {
                id: "id",
                name: "name",
                roles: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            await storages.groups.createOne(group);
            const foundGroup = await storages.groups.findOneByName("name");
            expect(foundGroup).to.deep.equal(group);
        });

        it("try to find a group by a non-existing name and get null", async () => {
            const notFoundGroup = await storages.groups.findOneByName("name");
            expect(notFoundGroup).to.equal(null);
        });

        it("create a group and get it back when finding many", async () => {
            const group = {
                id: "id",
                name: "name",
                roles: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            await storages.groups.createOne(group);
            const foundGroups = await storages.groups.findMany();
            expect(foundGroups).to.deep.equal([group]);
        });

        describe("create many groups and, finding them by id, get them back as expected", () => {
            it("case: roles is an empty array", async () => {
                const group = {
                    id: "id",
                    name: "name",
                    roles: [],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                await storages.groups.createOne(group);
                const foundGroup = await storages.groups.findOne("id");
                expect(foundGroup).to.deep.equal(group);
            });

            it("case: roles is a non-empty array", async () => {
                const group = {
                    id: "id",
                    name: "name",
                    roles: ["role"],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                await storages.groups.createOne(group);
                const foundGroup = await storages.groups.findOne("id");
                expect(foundGroup).to.deep.equal(group);
            });
        });

        it("create a group, update it, and get back the updated version when finding it by id", async () => {
            await storages.groups.createOne({
                id: "id",
                name: "name",
                roles: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            await storages.groups.updateOne("id", {
                name: undefined,
                roles: ["role"],
                updatedAt: new Date(),
            });
            const foundGroup = await storages.groups.findOne("id");
            // Test to see if undefined values passed to updateOne are correctly
            // ignored
            expect(foundGroup).to.have.property("name", "name");
            expect(foundGroup)
                .to.have.property("roles")
                .that.deep.equals(["role"]);
        });

        it("create a group, delete it, and verify it doesn't exist (anymore)", async () => {
            await storages.groups.createOne({
                id: "id",
                name: "name",
                roles: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            await storages.groups.deleteOne("id");
            const groupExists = await storages.groups.oneExistsWithName("name");
            expect(groupExists).to.equal(false);
        });
    });
};
