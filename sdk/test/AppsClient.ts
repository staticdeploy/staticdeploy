import { expect } from "chai";
import nock from "nock";

import StaticdeployClient from "../src";

const baseUrl = "http://localhost";
const staticdeployClient = new StaticdeployClient({
    apiUrl: baseUrl,
    apiToken: null,
});

beforeEach(() => {
    nock.cleanAll();
});

describe("AppsClient", () => {
    describe("getAll", () => {
        it("requests GET /apps", async () => {
            const scope = nock(baseUrl).get("/apps").reply(200, []);
            await staticdeployClient.apps.getAll();
            scope.done();
        });
        it("returns a list of apps", async () => {
            nock(baseUrl).get("/apps").reply(200, []);
            const apps = await staticdeployClient.apps.getAll();
            expect(apps).to.deep.equal([]);
        });
    });

    describe("getOne", () => {
        it("requests GET /apps/:appId", async () => {
            const scope = nock(baseUrl).get("/apps/id").reply(200);
            await staticdeployClient.apps.getOne("id");
            scope.done();
        });
        it("returns the app with the specified id", async () => {
            nock(baseUrl).get("/apps/id").reply(200, {});
            const app = await staticdeployClient.apps.getOne("id");
            expect(app).to.deep.equal({});
        });
    });

    describe("create", () => {
        it("requests POST /apps", async () => {
            const scope = nock(baseUrl)
                .post("/apps", { name: "name" })
                .reply(201);
            await staticdeployClient.apps.create({ name: "name" });
            scope.done();
        });
        it("returns the created app", async () => {
            nock(baseUrl).post("/apps").reply(201, {});
            const app = await staticdeployClient.apps.create({ name: "name" });
            expect(app).to.deep.equal({});
        });
    });

    describe("update", () => {
        it("requests PATCH /apps/:appId", async () => {
            const scope = nock(baseUrl)
                .patch("/apps/id", {
                    defaultConfiguration: { newKey: "newValue" },
                })
                .reply(200);
            await staticdeployClient.apps.update("id", {
                defaultConfiguration: { newKey: "newValue" },
            });
            scope.done();
        });
        it("returns the updated app", async () => {
            nock(baseUrl).patch("/apps/id").reply(200, {});
            const app = await staticdeployClient.apps.update("id", {
                defaultConfiguration: { newKey: "newValue" },
            });
            expect(app).to.deep.equal({});
        });
    });

    describe("delete", () => {
        it("requests DELETE /apps/:appId", async () => {
            const scope = nock(baseUrl).delete("/apps/id").reply(204);
            await staticdeployClient.apps.delete("id");
            scope.done();
        });
    });
});
