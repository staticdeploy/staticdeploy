import { expect } from "chai";

import * as errors from "../src/utils/errors";
import { eq } from "../src/utils/sequelizeOperators";
import { insertFixtures, models, storageClient } from "./setup";

describe("EntrypointsClient.findOneById", () => {
    beforeEach(async () => {
        await insertFixtures({
            apps: [{ id: "1", name: "1" }],
            entrypoints: [{ id: "1", appId: "1", urlMatcher: "1.com/" }]
        });
    });
    it("if an entrypoint with the specified id doesn't exist, returns null", async () => {
        const entrypoint = await storageClient.entrypoints.findOneById("2");
        expect(entrypoint).to.equal(null);
    });
    it("returns the found entrypoint as a pojo", async () => {
        const entrypoint = await storageClient.entrypoints.findOneById("1");
        expect(entrypoint).to.have.property("id", "1");
        expect(entrypoint).to.have.property("urlMatcher", "1.com/");
    });
});

describe("EntrypointsClient.findOneByIdOrUrlMatcher", () => {
    beforeEach(async () => {
        await insertFixtures({
            apps: [{ id: "1", name: "1" }],
            entrypoints: [{ id: "1", appId: "1", urlMatcher: "2.com/" }]
        });
    });
    it("if an entrypoint with the specified id or urlMatcher doesn't exist, returns null", async () => {
        const entrypoint = await storageClient.entrypoints.findOneByIdOrUrlMatcher(
            "3"
        );
        expect(entrypoint).to.equal(null);
    });
    it("returns the found entrypoint as a pojo", async () => {
        const entrypointById = await storageClient.entrypoints.findOneByIdOrUrlMatcher(
            "1"
        );
        expect(entrypointById).to.have.property("id", "1");
        expect(entrypointById).to.have.property("urlMatcher", "2.com/");
        const entrypointByUrlMatcher = await storageClient.entrypoints.findOneByIdOrUrlMatcher(
            "2.com/"
        );
        expect(entrypointByUrlMatcher).to.have.property("id", "1");
        expect(entrypointByUrlMatcher).to.have.property("urlMatcher", "2.com/");
    });
});

describe("EntrypointsClient.findManyByAppId", () => {
    beforeEach(async () => {
        await insertFixtures({
            apps: [{ id: "1", name: "1" }],
            entrypoints: [{ id: "1", appId: "1", urlMatcher: "1.com/" }]
        });
    });
    describe("returns all entrypoints with the specified appId as pojo-s", () => {
        it("case: existing entrypoints with specified appId", async () => {
            const entrypoints = await storageClient.entrypoints.findManyByAppId(
                "1"
            );
            expect(entrypoints).to.have.length(1);
            expect(entrypoints[0]).to.have.property("id", "1");
            expect(entrypoints[0]).to.have.property("urlMatcher", "1.com/");
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
            entrypoints: [{ id: "1", appId: "1", urlMatcher: "1.com/" }]
        });
    });
    it("returns all entrypoints as pojo-s", async () => {
        const entrypoints = await storageClient.entrypoints.findAll();
        expect(entrypoints).to.have.length(1);
        expect(entrypoints[0]).to.have.property("id", "1");
        expect(entrypoints[0]).to.have.property("urlMatcher", "1.com/");
    });
});

describe("EntrypointsClient.create", () => {
    beforeEach(async () => {
        await insertFixtures({
            apps: [{ id: "1", name: "1" }],
            entrypoints: [{ id: "1", appId: "1", urlMatcher: "2.com/" }]
        });
    });
    it("throws an UrlMatcherNotValidError if the urlMatcher is not valid", async () => {
        const createPromise = storageClient.entrypoints.create({
            appId: "1",
            urlMatcher: "1"
        });
        await expect(createPromise).to.be.rejectedWith(
            errors.EntrypointUrlMatcherNotValidError
        );
        await expect(createPromise).to.be.rejectedWith(
            "1 is not a valid urlMatcher"
        );
    });
    it("throws a ConfigurationNotValidError if the configuration is not valid", async () => {
        const createPromise = storageClient.entrypoints.create({
            appId: "1",
            urlMatcher: "1.com/",
            configuration: "not-valid" as any
        });
        await expect(createPromise).to.be.rejectedWith(
            errors.ConfigurationNotValidError
        );
        await expect(createPromise).to.be.rejectedWith(
            "configuration is not a valid configuration object"
        );
    });
    it("throws an AppNotFoundError if the entrypoint links to a non-existing app", async () => {
        const createPromise = storageClient.entrypoints.create({
            appId: "2",
            urlMatcher: "1.com/"
        });
        await expect(createPromise).to.be.rejectedWith(errors.AppNotFoundError);
        await expect(createPromise).to.be.rejectedWith(
            "No app found with id = 2"
        );
    });
    it("throws a BundleNotFoundError if the entrypoint links to a non-existing bundle", async () => {
        const createPromise = storageClient.entrypoints.create({
            appId: "1",
            bundleId: "1",
            urlMatcher: "1.com/"
        });
        await expect(createPromise).to.be.rejectedWith(
            errors.BundleNotFoundError
        );
        await expect(createPromise).to.be.rejectedWith(
            "No bundle found with id = 1"
        );
    });
    it("throws a ConflictingEntrypointError if an entrypoint with the same urlMatcher exists", async () => {
        const createPromise = storageClient.entrypoints.create({
            appId: "1",
            urlMatcher: "2.com/"
        });
        await expect(createPromise).to.be.rejectedWith(
            errors.ConflictingEntrypointError
        );
        await expect(createPromise).to.be.rejectedWith(
            "An entrypoint with urlMatcher = 2.com/ already exists"
        );
    });
    it("creates an entrypoint", async () => {
        await storageClient.entrypoints.create({
            appId: "1",
            urlMatcher: "1.com/"
        });
        const entrypointInstance = await models.Entrypoint.findOne({
            where: { urlMatcher: eq("1.com/") }
        });
        expect(entrypointInstance).not.to.equal(null);
    });
    it("returns the created entrypoint as a pojo", async () => {
        const entrypoint = await storageClient.entrypoints.create({
            appId: "1",
            urlMatcher: "1.com/"
        });
        const entrypointInstance = await models.Entrypoint.findOne({
            where: { urlMatcher: eq("1.com/") }
        });
        expect(entrypoint).to.deep.equal(entrypointInstance!.get());
    });
});

describe("EntrypointsClient.update", () => {
    beforeEach(async () => {
        await insertFixtures({
            apps: [{ id: "1", name: "1" }],
            entrypoints: [
                { id: "1", appId: "1", urlMatcher: "1.com/" },
                { id: "2", appId: "1", urlMatcher: "2.com/" }
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
    it("throws a BundleNotFoundError if the entrypoint links to a non-existing bundle", async () => {
        const updatePromise = storageClient.entrypoints.update("1", {
            bundleId: "1"
        });
        await expect(updatePromise).to.be.rejectedWith(
            errors.BundleNotFoundError
        );
        await expect(updatePromise).to.be.rejectedWith(
            "No bundle found with id = 1"
        );
    });
    it("throws an UrlMatcherNotValidError if the urlMatcher is not valid", async () => {
        const updatePromise = storageClient.entrypoints.update("1", {
            urlMatcher: "1"
        });
        await expect(updatePromise).to.be.rejectedWith(
            errors.EntrypointUrlMatcherNotValidError
        );
        await expect(updatePromise).to.be.rejectedWith(
            "1 is not a valid urlMatcher"
        );
    });
    it("throws a ConfigurationNotValidError if the configuration is not valid", async () => {
        const updatePromise = storageClient.entrypoints.update("1", {
            configuration: "not-valid" as any
        });
        await expect(updatePromise).to.be.rejectedWith(
            errors.ConfigurationNotValidError
        );
        await expect(updatePromise).to.be.rejectedWith(
            "configuration is not a valid configuration object"
        );
    });
    it("throws a ConflictingEntrypointError if an entrypoint with the same urlMatcher exists", async () => {
        const updatePromise = storageClient.entrypoints.update("1", {
            urlMatcher: "2.com/"
        });
        await expect(updatePromise).to.be.rejectedWith(
            errors.ConflictingEntrypointError
        );
        await expect(updatePromise).to.be.rejectedWith(
            "An entrypoint with urlMatcher = 2.com/ already exists"
        );
    });
    it("updates the entrypoint", async () => {
        await storageClient.entrypoints.update("1", { urlMatcher: "3.com/" });
        const entrypointInstance = await models.Entrypoint.findByPk("1");
        expect(entrypointInstance!.get("urlMatcher")).to.equal("3.com/");
    });
    it("returns the updated entrypoint as a pojo", async () => {
        const entrypoint = await storageClient.entrypoints.update("1", {
            urlMatcher: "3.com/"
        });
        expect(entrypoint).to.have.property("urlMatcher", "3.com/");
    });
});

describe("EntrypointsClient.delete", () => {
    beforeEach(async () => {
        await insertFixtures({
            apps: [{ id: "1", name: "1" }],
            entrypoints: [{ id: "1", urlMatcher: "1", appId: "1" }]
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
    it("deletes the entrypoint", async () => {
        await storageClient.entrypoints.delete("1");
        const entrypointInstance = await models.Entrypoint.findByPk("1");
        expect(entrypointInstance).to.equal(null);
    });
});
