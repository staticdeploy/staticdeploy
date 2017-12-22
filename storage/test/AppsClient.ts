import { expect } from "chai";

import { insertFixtures, models, storageClient } from "./setup";

describe("AppsClient.findOneById", () => {
    beforeEach(async () => {
        await insertFixtures({
            apps: [{ id: "1", name: "1" }]
        });
    });
    it("if an app by the specified id exists, returns it as a pojo", async () => {
        const app = await storageClient.apps.findOneById("1");
        expect(app).to.have.property("id", "1");
        expect(app).to.have.property("name", "1");
    });
    it("if an app by the specified id doesn't exist, returns null", async () => {
        const app = await storageClient.apps.findOneById("2");
        expect(app).to.equal(null);
    });
});

describe("AppsClient.findOneByName", () => {
    beforeEach(async () => {
        await insertFixtures({
            apps: [{ id: "1", name: "1" }]
        });
    });
    it("if an app by the specified name exists, returns it as a pojo", async () => {
        const app = await storageClient.apps.findOneByName("1");
        expect(app).to.have.property("id", "1");
        expect(app).to.have.property("name", "1");
    });
    it("if an app by the specified name doesn't exist, returns null", async () => {
        const app = await storageClient.apps.findOneByName("2");
        expect(app).to.equal(null);
    });
});

describe("AppsClient.findOneByIdOrName", () => {
    beforeEach(async () => {
        await insertFixtures({
            apps: [{ id: "1", name: "2" }]
        });
    });
    it("if an app by the specified id or name exists, returns it as a pojo", async () => {
        const appById = await storageClient.apps.findOneByIdOrName("1");
        expect(appById).to.have.property("id", "1");
        expect(appById).to.have.property("name", "2");
        const appByName = await storageClient.apps.findOneByIdOrName("2");
        expect(appByName).to.have.property("id", "1");
        expect(appByName).to.have.property("name", "2");
    });
    it("if an app by the specified id or name doesn't exist, returns null", async () => {
        const app = await storageClient.apps.findOneByIdOrName("3");
        expect(app).to.equal(null);
    });
});

describe("AppsClient.findAll", () => {
    beforeEach(async () => {
        await insertFixtures({
            apps: [{ id: "1", name: "1" }]
        });
    });
    it("returns all apps as pojo-s", async () => {
        const apps = await storageClient.apps.findAll();
        expect(apps).to.have.length(1);
        expect(apps[0]).to.have.property("id", "1");
        expect(apps[0]).to.have.property("name", "1");
    });
});

describe("AppsClient.create", () => {
    beforeEach(async () => {
        await insertFixtures({});
    });
    it("creates an app", async () => {
        await storageClient.apps.create({ name: "1" });
        const appInstance = await models.App.findOne({ where: { name: "1" } });
        expect(appInstance).not.to.equal(null);
    });
    it("returns the created app as a pojo", async () => {
        const app = await storageClient.apps.create({ name: "1" });
        expect(app).to.have.property("name", "1");
    });
});

describe("AppsClient.update", () => {
    beforeEach(async () => {
        await insertFixtures({
            apps: [{ id: "1", name: "1" }]
        });
    });
    it("throws an error if no app with the specified id exists", async () => {
        const updatePromise = storageClient.apps.update("2", { name: "2" });
        await expect(updatePromise).to.be.rejectedWith(
            "No app found with id = 2"
        );
    });
    it("updates the app", async () => {
        await storageClient.apps.update("1", { name: "2" });
        const appInstance = await models.App.findById("1");
        expect(appInstance!.get("name")).to.equal("2");
    });
    it("returns the updated app as a pojo", async () => {
        const app = await storageClient.apps.update("1", { name: "2" });
        expect(app).to.have.property("name", "2");
    });
});

describe("AppsClient.delete", () => {
    beforeEach(async () => {
        await insertFixtures({
            apps: [{ id: "1", name: "1" }],
            entrypoints: [{ id: "1", urlMatcher: "1", appId: "1" }]
        });
    });
    it("throws an error if no app with the specified id exists", async () => {
        const deletePromise = storageClient.apps.delete("2");
        await expect(deletePromise).to.be.rejectedWith(
            "No app found with id = 2"
        );
    });
    it("deletes all linked entrypoints", async () => {
        await storageClient.apps.delete("1");
        const entrypointInstances = await models.Entrypoint.findAll({
            where: { appId: "1" }
        });
        expect(entrypointInstances).to.have.length(0);
    });
    it("deletes the app", async () => {
        await storageClient.apps.delete("1");
        const appInstance = await models.App.findById("1");
        expect(appInstance).to.equal(null);
    });
});
