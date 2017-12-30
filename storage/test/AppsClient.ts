import { expect } from "chai";

import * as errors from "../src/utils/errors";
import { eq } from "../src/utils/sequelizeOperators";
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
        await insertFixtures({
            apps: [{ id: "2", name: "2" }]
        });
    });
    it("throws a ConflictingAppError if an app with the same name exists", async () => {
        const createPromise = storageClient.apps.create({ name: "2" });
        await expect(createPromise).to.be.rejectedWith(
            errors.ConflictingAppError
        );
        await expect(createPromise).to.be.rejectedWith(
            "An app with name = 2 already exists"
        );
    });
    it("creates an app", async () => {
        await storageClient.apps.create({ name: "1" });
        const appInstance = await models.App.findOne({
            where: { name: eq("1") }
        });
        expect(appInstance).not.to.equal(null);
    });
    it("returns the created app as a pojo", async () => {
        const app = await storageClient.apps.create({ name: "1" });
        const appInstance = await models.App.findOne({
            where: { name: eq("1") }
        });
        expect(app).to.deep.equal(appInstance!.get());
    });
});

describe("AppsClient.update", () => {
    beforeEach(async () => {
        await insertFixtures({
            apps: [{ id: "1", name: "1" }, { id: "2", name: "2" }]
        });
    });
    it("throws an AppNotFoundError if no app with the specified id exists", async () => {
        const updatePromise = storageClient.apps.update("3", {});
        await expect(updatePromise).to.be.rejectedWith(errors.AppNotFoundError);
        await expect(updatePromise).to.be.rejectedWith(
            "No app found with id = 3"
        );
    });
    it("throws a ConflictingAppError if an app with the same name exists", async () => {
        const updatePromise = storageClient.apps.update("1", { name: "2" });
        await expect(updatePromise).to.be.rejectedWith(
            errors.ConflictingAppError
        );
        await expect(updatePromise).to.be.rejectedWith(
            "An app with name = 2 already exists"
        );
    });
    it("updates the app", async () => {
        await storageClient.apps.update("1", { name: "3" });
        const appInstance = await models.App.findById("1");
        expect(appInstance!.get("name")).to.equal("3");
    });
    it("returns the updated app as a pojo", async () => {
        const app = await storageClient.apps.update("1", { name: "3" });
        expect(app).to.have.property("name", "3");
    });
});

describe("AppsClient.delete", () => {
    beforeEach(async () => {
        await insertFixtures({
            apps: [{ id: "1", name: "1" }],
            entrypoints: [{ id: "1", appId: "1", urlMatcher: "1.com/" }]
        });
    });
    it("throws an AppNotFoundError if no app with the specified id exists", async () => {
        const deletePromise = storageClient.apps.delete("2");
        await expect(deletePromise).to.be.rejectedWith(errors.AppNotFoundError);
        await expect(deletePromise).to.be.rejectedWith(
            "No app found with id = 2"
        );
    });
    it("deletes all linked entrypoints", async () => {
        await storageClient.apps.delete("1");
        const entrypointInstances = await models.Entrypoint.findAll({
            where: { appId: eq("1") }
        });
        expect(entrypointInstances).to.have.length(0);
    });
    it("deletes the app", async () => {
        await storageClient.apps.delete("1");
        const appInstance = await models.App.findById("1");
        expect(appInstance).to.equal(null);
    });
});
