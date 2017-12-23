import { expect } from "chai";

import * as errors from "../src/utils/errors";
import { insertFixtures, models, storageClient } from "./setup";

describe("EntrypointsClient.findOneById", () => {
    beforeEach(async () => {
        await insertFixtures({
            apps: [{ id: "1", name: "1" }],
            entrypoints: [{ id: "1", appId: "1", urlMatcher: "1" }]
        });
    });
    it("if an entrypoint by the specified id exists, returns it as a pojo", async () => {
        const entrypoint = await storageClient.entrypoints.findOneById("1");
        expect(entrypoint).to.have.property("id", "1");
        expect(entrypoint).to.have.property("urlMatcher", "1");
    });
    it("if an entrypoint by the specified id doesn't exist, returns null", async () => {
        const entrypoint = await storageClient.entrypoints.findOneById("2");
        expect(entrypoint).to.equal(null);
    });
});

describe("EntrypointsClient.findOneByIdOrUrlMatcher", () => {
    beforeEach(async () => {
        await insertFixtures({
            apps: [{ id: "1", name: "1" }],
            entrypoints: [{ id: "1", appId: "1", urlMatcher: "2" }]
        });
    });
    it("if an entrypoint by the specified id or urlMatcher exists, returns it as a pojo", async () => {
        const entrypointById = await storageClient.entrypoints.findOneByIdOrUrlMatcher(
            "1"
        );
        expect(entrypointById).to.have.property("id", "1");
        expect(entrypointById).to.have.property("urlMatcher", "2");
        const entrypointByUrlMatcher = await storageClient.entrypoints.findOneByIdOrUrlMatcher(
            "2"
        );
        expect(entrypointByUrlMatcher).to.have.property("id", "1");
        expect(entrypointByUrlMatcher).to.have.property("urlMatcher", "2");
    });
    it("if an entrypoint by the specified id or urlMatcher doesn't exist, returns null", async () => {
        const entrypoint = await storageClient.entrypoints.findOneByIdOrUrlMatcher(
            "3"
        );
        expect(entrypoint).to.equal(null);
    });
});

describe("EntrypointsClient.findManyByAppId", () => {
    beforeEach(async () => {
        await insertFixtures({
            apps: [{ id: "1", name: "1" }],
            entrypoints: [{ id: "1", appId: "1", urlMatcher: "1" }]
        });
    });
    describe("returns all entrypoints with the specified appId as pojo-s", () => {
        it("case: existing entrypoints with specified appId", async () => {
            const entrypoints = await storageClient.entrypoints.findManyByAppId(
                "1"
            );
            expect(entrypoints).to.have.length(1);
            expect(entrypoints[0]).to.have.property("id", "1");
            expect(entrypoints[0]).to.have.property("urlMatcher", "1");
        });
        it("case: no existing entrypoints with specified appId", async () => {
            const entrypoints = await storageClient.entrypoints.findManyByAppId(
                "2"
            );
            expect(entrypoints).to.have.length(0);
        });
    });
});

describe("EntrypointsClient.findAll", () => {
    beforeEach(async () => {
        await insertFixtures({
            apps: [{ id: "1", name: "1" }],
            entrypoints: [{ id: "1", appId: "1", urlMatcher: "1" }]
        });
    });
    it("returns all entrypoints as pojo-s", async () => {
        const entrypoints = await storageClient.entrypoints.findAll();
        expect(entrypoints).to.have.length(1);
        expect(entrypoints[0]).to.have.property("id", "1");
        expect(entrypoints[0]).to.have.property("urlMatcher", "1");
    });
});

describe("EntrypointsClient.create", () => {
    beforeEach(async () => {
        await insertFixtures({
            apps: [{ id: "1", name: "1" }],
            entrypoints: [{ id: "1", appId: "1", urlMatcher: "2" }]
        });
    });
    it("throws an AppNotFoundError if the entrypoint links to a non-existing app", async () => {
        const createPromise = storageClient.entrypoints.create({
            appId: "2",
            urlMatcher: "1"
        });
        await expect(createPromise).to.be.rejectedWith(errors.AppNotFoundError);
        await expect(createPromise).to.be.rejectedWith(
            "No app found with id = 2"
        );
    });
    it("throws a ConflictingEntrypointError if an entrypoint with the same urlMatcher exists", async () => {
        const createPromise = storageClient.entrypoints.create({
            appId: "1",
            urlMatcher: "2"
        });
        await expect(createPromise).to.be.rejectedWith(
            errors.ConflictingEntrypointError
        );
        await expect(createPromise).to.be.rejectedWith(
            "An entrypoint with urlMatcher = 2 already exists"
        );
    });
    it("creates an entrypoint", async () => {
        await storageClient.entrypoints.create({ appId: "1", urlMatcher: "1" });
        const entrypointInstance = await models.Entrypoint.findOne({
            where: { urlMatcher: "1" }
        });
        expect(entrypointInstance).not.to.equal(null);
    });
    it("returns the created entrypoint as a pojo", async () => {
        const entrypoint = await storageClient.entrypoints.create({
            appId: "1",
            urlMatcher: "1"
        });
        expect(entrypoint).to.have.property("urlMatcher", "1");
    });
});

describe("EntrypointsClient.update", () => {
    beforeEach(async () => {
        await insertFixtures({
            apps: [{ id: "1", name: "1" }],
            entrypoints: [
                { id: "1", appId: "1", urlMatcher: "1" },
                { id: "2", appId: "1", urlMatcher: "2" }
            ]
        });
    });
    it("throws an EntrypointNotFoundError if no entrypoint with the specified id exists", async () => {
        const updatePromise = storageClient.entrypoints.update("3", {});
        await expect(updatePromise).to.be.rejectedWith(
            errors.EntrypointNotFoundError
        );
        await expect(updatePromise).to.be.rejectedWith(
            "No entrypoint found with id = 3"
        );
    });
    it("throws an AppNotFoundError if the entrypoint links to a non-existing app", async () => {
        const updatePromise = storageClient.entrypoints.update("1", {
            appId: "2"
        });
        await expect(updatePromise).to.be.rejectedWith(errors.AppNotFoundError);
        await expect(updatePromise).to.be.rejectedWith(
            "No app found with id = 2"
        );
    });
    it("throws a DeploymentNotFoundError if the entrypoint links to a non-existing deployment", async () => {
        const updatePromise = storageClient.entrypoints.update("1", {
            activeDeploymentId: "1"
        });
        await expect(updatePromise).to.be.rejectedWith(
            errors.DeploymentNotFoundError
        );
        await expect(updatePromise).to.be.rejectedWith(
            "No deployment found with id = 1"
        );
    });
    it("throws a ConflictingEntrypointError if an entrypoint with the same urlMatcher exists", async () => {
        const updatePromise = storageClient.entrypoints.update("1", {
            urlMatcher: "2"
        });
        await expect(updatePromise).to.be.rejectedWith(
            errors.ConflictingEntrypointError
        );
        await expect(updatePromise).to.be.rejectedWith(
            "An entrypoint with urlMatcher = 2 already exists"
        );
    });
    it("updates the entrypoint", async () => {
        await storageClient.entrypoints.update("1", { urlMatcher: "3" });
        const entrypointInstance = await models.Entrypoint.findById("1");
        expect(entrypointInstance!.get("urlMatcher")).to.equal("3");
    });
    it("returns the updated entrypoint as a pojo", async () => {
        const entrypoint = await storageClient.entrypoints.update("1", {
            urlMatcher: "3"
        });
        expect(entrypoint).to.have.property("urlMatcher", "3");
    });
});

describe("EntrypointsClient.delete", () => {
    beforeEach(async () => {
        await insertFixtures({
            apps: [{ id: "1", name: "1" }],
            entrypoints: [{ id: "1", urlMatcher: "1", appId: "1" }],
            deployments: [{ id: "1", entrypointId: "1" }]
        });
    });
    it("throws an EntrypointNotFoundError if no entrypoint with the specified id exists", async () => {
        const deletePromise = storageClient.entrypoints.delete("2");
        await expect(deletePromise).to.be.rejectedWith(
            errors.EntrypointNotFoundError
        );
        await expect(deletePromise).to.be.rejectedWith(
            "No entrypoint found with id = 2"
        );
    });
    it("deletes all linked deployments", async () => {
        await storageClient.entrypoints.delete("1");
        const deploymentInstances = await models.Deployment.findAll({
            where: { entrypointId: "1" }
        });
        expect(deploymentInstances).to.have.length(0);
    });
    it("deletes the entrypoint", async () => {
        await storageClient.entrypoints.delete("1");
        const entrypointInstance = await models.Entrypoint.findById("1");
        expect(entrypointInstance).to.equal(null);
    });
});
