import { UserType } from "@staticdeploy/core";
import { expect } from "chai";
import nock from "nock";

import StaticdeployClient from "../src";

const baseUrl = "http://localhost";
const staticdeployClient = new StaticdeployClient({
    apiUrl: baseUrl,
    apiToken: null
});

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
    });

    describe("getCurrentUser", () => {
        it("requests GET /currentUser", async () => {
            const scope = nock(baseUrl)
                .get("/currentUser")
                .reply(200);
            await staticdeployClient.users.getCurrentUser();
            scope.done();
        });
        it("returns the user returned by the endpoint (the current user)", async () => {
            nock(baseUrl)
                .get("/currentUser")
                .reply(200, {});
            const user = await staticdeployClient.users.getCurrentUser();
            expect(user).to.deep.equal({});
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
