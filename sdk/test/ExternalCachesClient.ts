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

describe("ExternalCachesClient", () => {
    describe("getSupportedTypes", () => {
        it("requests GET /supportedExternalCacheTypes", async () => {
            const scope = nock(baseUrl)
                .get("/supportedExternalCacheTypes")
                .reply(200, []);
            await staticdeployClient.externalCaches.getSupportedTypes();
            scope.done();
        });
        it("returns a list of externalCacheTypes", async () => {
            nock(baseUrl)
                .get("/supportedExternalCacheTypes")
                .reply(200, []);
            const externalCacheTypes = await staticdeployClient.externalCaches.getSupportedTypes();
            expect(externalCacheTypes).to.deep.equal([]);
        });
    });

    describe("getAll", () => {
        it("requests GET /externalCaches", async () => {
            const scope = nock(baseUrl)
                .get("/externalCaches")
                .reply(200, []);
            await staticdeployClient.externalCaches.getAll();
            scope.done();
        });
        it("returns a list of externalCaches", async () => {
            nock(baseUrl)
                .get("/externalCaches")
                .reply(200, []);
            const externalCaches = await staticdeployClient.externalCaches.getAll();
            expect(externalCaches).to.deep.equal([]);
        });
    });

    describe("getOne", () => {
        it("requests GET /externalCaches/:externalCacheId", async () => {
            const scope = nock(baseUrl)
                .get("/externalCaches/id")
                .reply(200);
            await staticdeployClient.externalCaches.getOne("id");
            scope.done();
        });
        it("returns the externalCache with the specified id", async () => {
            nock(baseUrl)
                .get("/externalCaches/id")
                .reply(200, {});
            const externalCache = await staticdeployClient.externalCaches.getOne(
                "id"
            );
            expect(externalCache).to.deep.equal({});
        });
    });

    describe("create", () => {
        it("requests POST /externalCaches", async () => {
            const scope = nock(baseUrl)
                .post("/externalCaches", {
                    domain: "domain.com",
                    type: "type",
                    configuration: {}
                })
                .reply(201);
            await staticdeployClient.externalCaches.create({
                domain: "domain.com",
                type: "type",
                configuration: {}
            });
            scope.done();
        });
        it("returns the created externalCache", async () => {
            nock(baseUrl)
                .post("/externalCaches")
                .reply(201, {});
            const externalCache = await staticdeployClient.externalCaches.create(
                { domain: "domain.com", type: "type", configuration: {} }
            );
            expect(externalCache).to.deep.equal({});
        });
    });

    describe("update", () => {
        it("requests PATCH /externalCaches/:externalCacheId", async () => {
            const scope = nock(baseUrl)
                .patch("/externalCaches/id", {
                    configuration: { newKey: "newValue" }
                })
                .reply(200);
            await staticdeployClient.externalCaches.update("id", {
                configuration: { newKey: "newValue" }
            });
            scope.done();
        });
        it("returns the updated externalCache", async () => {
            nock(baseUrl)
                .patch("/externalCaches/id")
                .reply(200, {});
            const externalCache = await staticdeployClient.externalCaches.update(
                "id",
                { configuration: { newKey: "newValue" } }
            );
            expect(externalCache).to.deep.equal({});
        });
    });

    describe("delete", () => {
        it("requests DELETE /externalCaches/:externalCacheId", async () => {
            const scope = nock(baseUrl)
                .delete("/externalCaches/id")
                .reply(204);
            await staticdeployClient.externalCaches.delete("id");
            scope.done();
        });
    });
});
