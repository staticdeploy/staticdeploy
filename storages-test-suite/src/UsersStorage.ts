import { IStorages, IUser, UserType } from "@staticdeploy/core";
import { expect } from "chai";
import { omit } from "lodash";

function omitGroupsIds(
    userWithGroupsIds: IUser & { groupsIds: string[] }
): IUser {
    return omit(userWithGroupsIds, "groupsIds");
}

export default (storages: IStorages) => {
    describe("UsersStorage", () => {
        const groups = [
            {
                id: "id0",
                name: "name0",
                roles: ["role0"],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: "id1",
                name: "name1",
                roles: ["role1"],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];
        beforeEach(async () => {
            // The core module requires a group to exist if we want a user to link to it,
            // hence we create some groups users can link to
            for (const group of groups) {
                await storages.groups.createOne(group);
            }
        });

        it("create a user and verify that one user with its idp / idpId combination exists", async () => {
            await storages.users.createOne({
                id: "id",
                idp: "idp",
                idpId: "idpId",
                type: UserType.Human,
                name: "name",
                groupsIds: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            const userExists = await storages.users.oneExistsWithIdpAndIdpId(
                "idp",
                "idpId"
            );
            expect(userExists).to.equal(true);
        });

        it("check if one user with a non-existing idp / idpId combination exists and get false", async () => {
            const userExists = await storages.users.oneExistsWithIdpAndIdpId(
                "idp",
                "idpId"
            );
            expect(userExists).to.equal(false);
        });

        it("create a user and verify that (at least) one user with its groupId exists", async () => {
            await storages.users.createOne({
                id: "id",
                idp: "idp",
                idpId: "idpId",
                type: UserType.Human,
                name: "name",
                groupsIds: ["id0"],
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            const anyUserExists = await storages.users.anyExistsWithGroup(
                "id0"
            );
            expect(anyUserExists).to.equal(true);
        });

        it("check if (at least) one user with a non-existing groupId exists and get false", async () => {
            const anyUserExists = await storages.users.anyExistsWithGroup(
                "id0"
            );
            expect(anyUserExists).to.equal(false);
        });

        it("create a user and find it by id", async () => {
            const user = {
                id: "id",
                idp: "idp",
                idpId: "idpId",
                type: UserType.Human,
                name: "name",
                groupsIds: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            await storages.users.createOne(user);
            const foundUser = await storages.users.findOne("id");
            expect(foundUser).to.deep.equal(omitGroupsIds(user));
        });

        it("try to find a user by a non-existing id and get null", async () => {
            const notFoundUser = await storages.users.findOne("id");
            expect(notFoundUser).to.equal(null);
        });

        it("create a user with groups and find it, with groups, by id", async () => {
            const user = {
                id: "id",
                idp: "idp",
                idpId: "idpId",
                type: UserType.Human,
                name: "name",
                groupsIds: ["id0", "id1"],
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            await storages.users.createOne(user);
            const foundUser = await storages.users.findOneWithGroups("id");
            expect(foundUser).to.deep.equal({ ...omitGroupsIds(user), groups });
        });

        it("try to find a user, with groups, by a non-existing id and get null", async () => {
            const notFoundUser = await storages.users.findOneWithGroups("id");
            expect(notFoundUser).to.equal(null);
        });

        it("create a user with groups and find it, with roles, by idp and idpId", async () => {
            const user = {
                id: "id",
                idp: "idp",
                idpId: "idpId",
                type: UserType.Human,
                name: "name",
                groupsIds: ["id0", "id1"],
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            await storages.users.createOne(user);
            const foundUser =
                await storages.users.findOneWithRolesByIdpAndIdpId(
                    "idp",
                    "idpId"
                );
            expect(foundUser).to.deep.equal({
                ...omitGroupsIds(user),
                roles: ["role0", "role1"],
            });
        });

        it("try to find a user, with roles, by a non-existing idp / idpId combination and get null", async () => {
            const notFoundUser =
                await storages.users.findOneWithRolesByIdpAndIdpId(
                    "idp",
                    "idpId"
                );
            expect(notFoundUser).to.equal(null);
        });

        it("create a user and get it back when finding many", async () => {
            const user = {
                id: "id",
                idp: "idp",
                idpId: "idpId",
                type: UserType.Human,
                name: "name",
                groupsIds: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            await storages.users.createOne(user);
            const foundUsers = await storages.users.findMany();
            expect(foundUsers).to.deep.equal([omitGroupsIds(user)]);
        });

        describe("create many users and, finding them by id, get them back as expected", () => {
            it("case: groupsIds is an empty array", async () => {
                const user = {
                    id: "id",
                    idp: "idp",
                    idpId: "idpId",
                    type: UserType.Human,
                    name: "name",
                    groupsIds: [],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                await storages.users.createOne(user);
                const foundUser = await storages.users.findOne("id");
                expect(foundUser).to.deep.equal(omitGroupsIds(user));
            });

            it("case: groupsIds is a non-empty array", async () => {
                const user = {
                    id: "id",
                    idp: "idp",
                    idpId: "idpId",
                    type: UserType.Human,
                    name: "name",
                    groupsIds: ["id0"],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                await storages.users.createOne(user);
                const foundUser = await storages.users.findOne("id");
                expect(foundUser).to.deep.equal(omitGroupsIds(user));
            });
        });

        it("create a user, update it, and get back the updated version when finding it by id", async () => {
            await storages.users.createOne({
                id: "id",
                idp: "idp",
                idpId: "idpId",
                type: UserType.Human,
                name: "name",
                groupsIds: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            await storages.users.updateOne("id", {
                name: undefined,
                groupsIds: ["id0"],
                updatedAt: new Date(),
            });
            const foundUser = await storages.users.findOneWithGroups("id");
            // Test to see if undefined values passed to updateOne are correctly
            // ignored
            expect(foundUser).to.have.property("name", "name");
            expect(foundUser)
                .to.have.property("groups")
                .that.deep.equals([groups[0]]);
        });

        it("create a user with some groups, update it removing all groups, and get back the updated version when finding it by id", async () => {
            await storages.users.createOne({
                id: "id",
                idp: "idp",
                idpId: "idpId",
                type: UserType.Human,
                name: "name",
                groupsIds: ["id0", "id1"],
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            await storages.users.updateOne("id", {
                groupsIds: [],
                updatedAt: new Date(),
            });
            const foundUser = await storages.users.findOneWithGroups("id");
            expect(foundUser).to.have.property("groups").that.deep.equals([]);
        });

        it("create a user, delete it, and verify it doesn't exist (anymore)", async () => {
            await storages.users.createOne({
                id: "id",
                idp: "idp",
                idpId: "idpId",
                type: UserType.Human,
                name: "name",
                groupsIds: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            await storages.users.deleteOne("id");
            const userExists = await storages.users.oneExistsWithIdpAndIdpId(
                "idp",
                "idpId"
            );
            expect(userExists).to.equal(false);
        });
    });
};
