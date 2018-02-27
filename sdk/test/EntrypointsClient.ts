import Axios from "axios";
import { expect } from "chai";
import nock from "nock";

import EntrypointsClient from "../src/EntrypointsClient";

const baseUrl = "http://localhost";
const axios = Axios.create({ baseURL: baseUrl });
const entrypointsClient = new EntrypointsClient(axios);
const unixEpoch = new Date(0);
const unixEpochISO = unixEpoch.toISOString();

beforeEach(() => {
    nock.cleanAll();
});

describe("EntrypointsClient", () => {
    describe("getAll", () => {
        it("requests GET /entrypoints", async () => {
            const scope = nock(baseUrl)
                .get("/entrypoints")
                .reply(200, []);
            await entrypointsClient.getAll();
            scope.done();
        });
        it("optionally sets a filter on the request with querystrig parameter ?appIdOrName", async () => {
            const scope = nock(baseUrl)
                .get("/entrypoints?appIdOrName=value")
                .reply(200, []);
            await entrypointsClient.getAll({ appIdOrName: "value" });
            scope.done();
        });
        it("returns a list of entrypoints", async () => {
            nock(baseUrl)
                .get("/entrypoints")
                .reply(200, []);
            const entrypoints = await entrypointsClient.getAll();
            expect(entrypoints).to.deep.equal([]);
        });
        it("inflates dates", async () => {
            nock(baseUrl)
                .get("/entrypoints")
                .reply(200, [
                    { createdAt: unixEpochISO, updatedAt: unixEpochISO }
                ]);
            const entrypoints = await entrypointsClient.getAll();
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
            await entrypointsClient.getOne("id");
            scope.done();
        });
        it("returns the entrypoint with the specified id", async () => {
            nock(baseUrl)
                .get("/entrypoints/id")
                .reply(200, {});
            const entrypoint = await entrypointsClient.getOne("id");
            expect(entrypoint).to.deep.equal({});
        });
        it("inflates dates", async () => {
            nock(baseUrl)
                .get("/entrypoints/id")
                .reply(200, {
                    createdAt: unixEpochISO,
                    updatedAt: unixEpochISO
                });
            const entrypoint = await entrypointsClient.getOne("id");
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
            await entrypointsClient.create({
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
            const entrypoint = await entrypointsClient.create({
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
            const entrypoint = await entrypointsClient.create({
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
            await entrypointsClient.delete("id");
            scope.done();
        });
    });

    describe("update", () => {
        it("requests PATCH /entrypoints/:entrypointId", async () => {
            const scope = nock(baseUrl)
                .patch("/entrypoints/id", { appId: "newAppId" })
                .reply(200);
            await entrypointsClient.update("id", { appId: "newAppId" });
            scope.done();
        });
        it("returns the updated entrypoint", async () => {
            nock(baseUrl)
                .patch("/entrypoints/id", { appId: "newAppId" })
                .reply(200, {});
            const entrypoint = await entrypointsClient.update("id", {
                appId: "newAppId"
            });
            expect(entrypoint).to.deep.equal({});
        });
        it("inflates dates", async () => {
            nock(baseUrl)
                .patch("/entrypoints/id", { appId: "newAppId" })
                .reply(200, {
                    createdAt: unixEpochISO,
                    updatedAt: unixEpochISO
                });
            const entrypoint = await entrypointsClient.update("id", {
                appId: "newAppId"
            });
            expect(entrypoint).to.deep.equal({
                createdAt: unixEpoch,
                updatedAt: unixEpoch
            });
        });
    });
});
