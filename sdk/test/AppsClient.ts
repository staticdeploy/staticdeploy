import Axios from "axios";
import { expect } from "chai";
import nock = require("nock");

import AppsClient from "../src/AppsClient";

const baseUrl = "http://localhost";
const axios = Axios.create({ baseURL: baseUrl });
const appsClient = new AppsClient(axios);

beforeEach(() => {
    nock.cleanAll();
});

describe("AppsClient", () => {
    describe("getAll", () => {
        it("requests GET /apps", async () => {
            const scope = nock(baseUrl)
                .get("/apps")
                .reply(200);
            await appsClient.getAll();
            scope.done();
        });
        it("returns a list of apps", async () => {
            nock(baseUrl)
                .get("/apps")
                // For testing it's enough to simulate the API returning an
                // empty array
                .reply(200, []);
            const apps = await appsClient.getAll();
            expect(apps).to.deep.equal([]);
        });
    });

    describe("getOne", () => {
        it("requests GET /apps/:appId", async () => {
            const scope = nock(baseUrl)
                .get("/apps/id")
                .reply(200);
            await appsClient.getOne("id");
            scope.done();
        });
        it("returns the app with the specified id", async () => {
            nock(baseUrl)
                .get("/apps/id")
                .reply(200, {
                    id: "id",
                    name: "name",
                    defaultConfiguration: {}
                });
            const app = await appsClient.getOne("id");
            expect(app).to.deep.equal({
                id: "id",
                name: "name",
                defaultConfiguration: {}
            });
        });
    });

    describe("create", () => {
        it("requests POST /apps", async () => {
            const scope = nock(baseUrl)
                .post("/apps", { name: "name" })
                .reply(201);
            await appsClient.create({ name: "name" });
            scope.done();
        });
        it("returns the created app", async () => {
            nock(baseUrl)
                .post("/apps", { name: "name" })
                .reply(201, {
                    id: "id",
                    name: "name",
                    defaultConfiguration: {}
                });
            const app = await appsClient.create({ name: "name" });
            expect(app).to.deep.equal({
                id: "id",
                name: "name",
                defaultConfiguration: {}
            });
        });
    });

    describe("delete", () => {
        it("requests DELETE /apps/:appId", async () => {
            const scope = nock(baseUrl)
                .delete("/apps/id")
                .reply(204);
            await appsClient.delete("id");
            scope.done();
        });
    });

    describe("update", () => {
        it("requests PATCH /apps/:appId", async () => {
            const scope = nock(baseUrl)
                .patch("/apps/id", { name: "new-name" })
                .reply(200);
            await appsClient.update("id", { name: "new-name" });
            scope.done();
        });
        it("returns the updated app", async () => {
            nock(baseUrl)
                .patch("/apps/id", { name: "new-name" })
                .reply(200, {
                    id: "id",
                    name: "new-name",
                    defaultConfiguration: {}
                });
            const app = await appsClient.update("id", { name: "new-name" });
            expect(app).to.deep.equal({
                id: "id",
                name: "new-name",
                defaultConfiguration: {}
            });
        });
    });
});
