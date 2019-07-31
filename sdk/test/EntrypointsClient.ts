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

describe("EntrypointsClient", () => {
    describe("getAll", () => {
        it("requests GET /entrypoints?appId", async () => {
            const scope = nock(baseUrl)
                .get("/entrypoints?appId=appId")
                .reply(200, []);
            await staticdeployClient.entrypoints.getAll({ appId: "appId" });
            scope.done();
        });
        it("returns a list of entrypoints", async () => {
            nock(baseUrl)
                .get("/entrypoints?appId=appId")
                .reply(200, []);
            const entrypoints = await staticdeployClient.entrypoints.getAll({
                appId: "appId"
            });
            expect(entrypoints).to.deep.equal([]);
        });
        it("inflates dates", async () => {
            nock(baseUrl)
                .get("/entrypoints?appId=appId")
                .reply(200, [
                    { createdAt: unixEpochISO, updatedAt: unixEpochISO }
                ]);
            const entrypoints = await staticdeployClient.entrypoints.getAll({
                appId: "appId"
            });
            expect(entrypoints).to.deep.equal([
                { createdAt: unixEpoch, updatedAt: unixEpoch }
            ]);
        });
    });

    describe("getOne", () => {
        it("requests GET /entrypoints/:entrypointId", async () => {
            const scope = nock(baseUrl)
                .get("/entrypoints/id")
                .reply(200);
            await staticdeployClient.entrypoints.getOne("id");
            scope.done();
        });
        it("returns the entrypoint with the specified id", async () => {
            nock(baseUrl)
                .get("/entrypoints/id")
                .reply(200, {});
            const entrypoint = await staticdeployClient.entrypoints.getOne(
                "id"
            );
            expect(entrypoint).to.deep.equal({});
        });
        it("inflates dates", async () => {
            nock(baseUrl)
                .get("/entrypoints/id")
                .reply(200, {
                    createdAt: unixEpochISO,
                    updatedAt: unixEpochISO
                });
            const entrypoint = await staticdeployClient.entrypoints.getOne(
                "id"
            );
            expect(entrypoint).to.deep.equal({
                createdAt: unixEpoch,
                updatedAt: unixEpoch
            });
        });
    });

    describe("create", () => {
        it("requests POST /entrypoints", async () => {
            const scope = nock(baseUrl)
                .post("/entrypoints", {
                    appId: "appId",
                    urlMatcher: "urlMatcher"
                })
                .reply(201);
            await staticdeployClient.entrypoints.create({
                appId: "appId",
                urlMatcher: "urlMatcher"
            });
            scope.done();
        });
        it("returns the created entrypoint", async () => {
            nock(baseUrl)
                .post("/entrypoints", {
                    appId: "appId",
                    urlMatcher: "urlMatcher"
                })
                .reply(201, {});
            const entrypoint = await staticdeployClient.entrypoints.create({
                appId: "appId",
                urlMatcher: "urlMatcher"
            });
            expect(entrypoint).to.deep.equal({});
        });
        it("inflates dates", async () => {
            nock(baseUrl)
                .post("/entrypoints", {
                    appId: "appId",
                    urlMatcher: "urlMatcher"
                })
                .reply(201, {
                    createdAt: unixEpochISO,
                    updatedAt: unixEpochISO
                });
            const entrypoint = await staticdeployClient.entrypoints.create({
                appId: "appId",
                urlMatcher: "urlMatcher"
            });
            expect(entrypoint).to.deep.equal({
                createdAt: unixEpoch,
                updatedAt: unixEpoch
            });
        });
    });

    describe("delete", () => {
        it("requests DELETE /entrypoints/:entrypointId", async () => {
            const scope = nock(baseUrl)
                .delete("/entrypoints/id")
                .reply(204);
            await staticdeployClient.entrypoints.delete("id");
            scope.done();
        });
    });

    describe("update", () => {
        it("requests PATCH /entrypoints/:entrypointId", async () => {
            const scope = nock(baseUrl)
                .patch("/entrypoints/id", { bundleId: "newBundleId" })
                .reply(200);
            await staticdeployClient.entrypoints.update("id", {
                bundleId: "newBundleId"
            });
            scope.done();
        });
        it("returns the updated entrypoint", async () => {
            nock(baseUrl)
                .patch("/entrypoints/id", { bundleId: "newBundleId" })
                .reply(200, {});
            const entrypoint = await staticdeployClient.entrypoints.update(
                "id",
                { bundleId: "newBundleId" }
            );
            expect(entrypoint).to.deep.equal({});
        });
        it("inflates dates", async () => {
            nock(baseUrl)
                .patch("/entrypoints/id", { bundleId: "newBundleId" })
                .reply(200, {
                    createdAt: unixEpochISO,
                    updatedAt: unixEpochISO
                });
            const entrypoint = await staticdeployClient.entrypoints.update(
                "id",
                { bundleId: "newBundleId" }
            );
            expect(entrypoint).to.deep.equal({
                createdAt: unixEpoch,
                updatedAt: unixEpoch
            });
        });
    });
});
