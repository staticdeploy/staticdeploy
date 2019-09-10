import { UserType } from "@staticdeploy/core";
import { expect } from "chai";
import nock from "nock";

import StaticdeployClient from "../src";

const baseUrl = "http://localhost";
const staticdeployClient = new StaticdeployClient({ apiUrl: baseUrl });
const unixEpoch = new Date(0);
const unixEpochISO = unixEpoch.toISOString();

beforeEach(() => {
    nock.cleanAll();
});

describe("UsersClient", () => {
    describe("getAll", () => {
        it("requests GET /users", async () => {
            const scope = nock(baseUrl)
                .get("/users")
                .reply(200, []);
            await staticdeployClient.users.getAll();
            scope.done();
        });
        it("returns a list of users", async () => {
            nock(baseUrl)
                .get("/users")
                .reply(200, []);
            const users = await staticdeployClient.users.getAll();
            expect(users).to.deep.equal([]);
        });
        it("inflates dates", async () => {
            nock(baseUrl)
                .get("/users")
                .reply(200, [
                    { createdAt: unixEpochISO, updatedAt: unixEpochISO }
                ]);
            const users = await staticdeployClient.users.getAll();
            expect(users).to.deep.equal([
                { createdAt: unixEpoch, updatedAt: unixEpoch }
            ]);
        });
    });

    describe("getOne", () => {
        it("requests GET /users/:userId", async () => {
            const scope = nock(baseUrl)
                .get("/users/id")
                .reply(200);
            await staticdeployClient.users.getOne("id");
            scope.done();
        });
        it("returns the user with the specified id", async () => {
            nock(baseUrl)
                .get("/users/id")
                .reply(200, {});
            const user = await staticdeployClient.users.getOne("id");
            expect(user).to.deep.equal({});
        });
        it("inflates dates", async () => {
            nock(baseUrl)
                .get("/users/id")
                .reply(200, {
                    createdAt: unixEpochISO,
                    updatedAt: unixEpochISO
                });
            const user = await staticdeployClient.users.getOne("id");
            expect(user).to.deep.equal({
                createdAt: unixEpoch,
                updatedAt: unixEpoch
            });
        });
    });

    describe("create", () => {
        it("requests POST /users", async () => {
            const scope = nock(baseUrl)
                .post("/users", {
                    idp: "idp",
                    idpId: "idpId",
                    type: UserType.Human,
                    name: "name",
                    groupsIds: []
                })
                .reply(201);
            await staticdeployClient.users.create({
                idp: "idp",
                idpId: "idpId",
                type: UserType.Human,
                name: "name",
                groupsIds: []
            });
            scope.done();
        });
        it("returns the created user", async () => {
            nock(baseUrl)
                .post("/users")
                .reply(201, {});
            const user = await staticdeployClient.users.create({
                idp: "idp",
                idpId: "idpId",
                type: UserType.Human,
                name: "name",
                groupsIds: []
            });
            expect(user).to.deep.equal({});
        });
        it("inflates dates", async () => {
            nock(baseUrl)
                .post("/users")
                .reply(201, {
                    createdAt: unixEpochISO,
                    updatedAt: unixEpochISO
                });
            const user = await staticdeployClient.users.create({
                idp: "idp",
                idpId: "idpId",
                type: UserType.Human,
                name: "name",
                groupsIds: []
            });
            expect(user).to.deep.equal({
                createdAt: unixEpoch,
                updatedAt: unixEpoch
            });
        });
    });

    describe("update", () => {
        it("requests PATCH /users/:userId", async () => {
            const scope = nock(baseUrl)
                .patch("/users/id", { name: "new-name" })
                .reply(200);
            await staticdeployClient.users.update("id", { name: "new-name" });
            scope.done();
        });
        it("returns the updated user", async () => {
            nock(baseUrl)
                .patch("/users/id")
                .reply(200, {});
            const user = await staticdeployClient.users.update("id", {
                name: "new-name"
            });
            expect(user).to.deep.equal({});
        });
        it("inflates dates", async () => {
            nock(baseUrl)
                .patch("/users/id")
                .reply(200, {
                    createdAt: unixEpochISO,
                    updatedAt: unixEpochISO
                });
            const user = await staticdeployClient.users.update("id", {
                name: "new-name"
            });
            expect(user).to.deep.equal({
                createdAt: unixEpoch,
                updatedAt: unixEpoch
            });
        });
    });

    describe("delete", () => {
        it("requests DELETE /users/:userId", async () => {
            const scope = nock(baseUrl)
                .delete("/users/id")
                .reply(204);
            await staticdeployClient.users.delete("id");
            scope.done();
        });
    });
});
