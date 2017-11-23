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
                .reply(200, [
                    { id: "id", name: "name", defaultConfiguration: {} }
                ]);
            await appsClient.getAll();
            scope.done();
        });
        it("returns a list of apps", async () => {
            nock(baseUrl)
                .get("/apps")
                .reply(200, [
                    { id: "id", name: "name", defaultConfiguration: {} }
                ]);
            const apps = await appsClient.getAll();
            expect(apps).to.deep.equal([
                { id: "id", name: "name", defaultConfiguration: {} }
            ]);
        });
    });

    describe("getOne", () => {
        it("requests GET /apps/:appId", async () => {
            const scope = nock(baseUrl)
                .get("/apps/id")
                .reply(200, {
                    id: "id",
                    name: "name",
                    defaultConfiguration: {}
                });
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
                .reply(201, {
                    id: "id",
                    name: "name",
                    defaultConfiguration: {}
                });
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

    describe("updateName", () => {
        it("requests PUT /apps/:appId/name", async () => {
            const scope = nock(baseUrl, {
                reqheaders: { "Content-Type": "application/json" }
            })
                .put("/apps/id/name", '"new-name"')
                .reply(200, {
                    id: "id",
                    name: "new-name",
                    defaultConfiguration: {}
                });
            await appsClient.updateName("id", "new-name");
            scope.done();
        });
        it("returns the updated app", async () => {
            nock(baseUrl)
                .put("/apps/id/name", '"new-name"')
                .reply(200, {
                    id: "id",
                    name: "new-name",
                    defaultConfiguration: {}
                });
            const app = await appsClient.updateName("id", "new-name");
            expect(app).to.deep.equal({
                id: "id",
                name: "new-name",
                defaultConfiguration: {}
            });
        });
    });

    describe("updateDefaultConfiguration", () => {
        it("requests PUT /apps/:appId/defaultConfiguration", async () => {
            const scope = nock(baseUrl)
                .put("/apps/id/defaultConfiguration", { key: "value" })
                .reply(200, {
                    id: "id",
                    name: "name",
                    defaultConfiguration: { key: "value" }
                });
            await appsClient.updateDefaultConfiguration("id", { key: "value" });
            scope.done();
        });
        it("returns the updated app", async () => {
            nock(baseUrl)
                .put("/apps/id/defaultConfiguration", { key: "value" })
                .reply(200, {
                    id: "id",
                    name: "name",
                    defaultConfiguration: { key: "value" }
                });
            const app = await appsClient.updateDefaultConfiguration("id", {
                key: "value"
            });
            expect(app).to.deep.equal({
                id: "id",
                name: "name",
                defaultConfiguration: { key: "value" }
            });
        });
    });
});
