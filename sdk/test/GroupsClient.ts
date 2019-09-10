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

describe("GroupsClient", () => {
    describe("getAll", () => {
        it("requests GET /groups", async () => {
            const scope = nock(baseUrl)
                .get("/groups")
                .reply(200, []);
            await staticdeployClient.groups.getAll();
            scope.done();
        });
        it("returns a list of groups", async () => {
            nock(baseUrl)
                .get("/groups")
                .reply(200, []);
            const groups = await staticdeployClient.groups.getAll();
            expect(groups).to.deep.equal([]);
        });
        it("inflates dates", async () => {
            nock(baseUrl)
                .get("/groups")
                .reply(200, [
                    { createdAt: unixEpochISO, updatedAt: unixEpochISO }
                ]);
            const groups = await staticdeployClient.groups.getAll();
            expect(groups).to.deep.equal([
                { createdAt: unixEpoch, updatedAt: unixEpoch }
            ]);
        });
    });

    describe("getOne", () => {
        it("requests GET /groups/:groupId", async () => {
            const scope = nock(baseUrl)
                .get("/groups/id")
                .reply(200);
            await staticdeployClient.groups.getOne("id");
            scope.done();
        });
        it("returns the group with the specified id", async () => {
            nock(baseUrl)
                .get("/groups/id")
                .reply(200, {});
            const group = await staticdeployClient.groups.getOne("id");
            expect(group).to.deep.equal({});
        });
        it("inflates dates", async () => {
            nock(baseUrl)
                .get("/groups/id")
                .reply(200, {
                    createdAt: unixEpochISO,
                    updatedAt: unixEpochISO
                });
            const group = await staticdeployClient.groups.getOne("id");
            expect(group).to.deep.equal({
                createdAt: unixEpoch,
                updatedAt: unixEpoch
            });
        });
    });

    describe("create", () => {
        it("requests POST /groups", async () => {
            const scope = nock(baseUrl)
                .post("/groups", { name: "name", roles: [] })
                .reply(201);
            await staticdeployClient.groups.create({ name: "name", roles: [] });
            scope.done();
        });
        it("returns the created group", async () => {
            nock(baseUrl)
                .post("/groups")
                .reply(201, {});
            const group = await staticdeployClient.groups.create({
                name: "name",
                roles: []
            });
            expect(group).to.deep.equal({});
        });
        it("inflates dates", async () => {
            nock(baseUrl)
                .post("/groups")
                .reply(201, {
                    createdAt: unixEpochISO,
                    updatedAt: unixEpochISO
                });
            const group = await staticdeployClient.groups.create({
                name: "name",
                roles: []
            });
            expect(group).to.deep.equal({
                createdAt: unixEpoch,
                updatedAt: unixEpoch
            });
        });
    });

    describe("update", () => {
        it("requests PATCH /groups/:groupId", async () => {
            const scope = nock(baseUrl)
                .patch("/groups/id", { name: "new-name" })
                .reply(200);
            await staticdeployClient.groups.update("id", { name: "new-name" });
            scope.done();
        });
        it("returns the updated group", async () => {
            nock(baseUrl)
                .patch("/groups/id")
                .reply(200, {});
            const group = await staticdeployClient.groups.update("id", {
                name: "new-name"
            });
            expect(group).to.deep.equal({});
        });
        it("inflates dates", async () => {
            nock(baseUrl)
                .patch("/groups/id")
                .reply(200, {
                    createdAt: unixEpochISO,
                    updatedAt: unixEpochISO
                });
            const group = await staticdeployClient.groups.update("id", {
                name: "new-name"
            });
            expect(group).to.deep.equal({
                createdAt: unixEpoch,
                updatedAt: unixEpoch
            });
        });
    });

    describe("delete", () => {
        it("requests DELETE /groups/:groupId", async () => {
            const scope = nock(baseUrl)
                .delete("/groups/id")
                .reply(204);
            await staticdeployClient.groups.delete("id");
            scope.done();
        });
    });
});
