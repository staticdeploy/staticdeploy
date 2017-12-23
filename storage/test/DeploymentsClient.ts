import { expect } from "chai";
import { createTree, destroyTree } from "create-fs-tree";
import { pathExists } from "fs-extra";
import { readFile } from "mz/fs";
import os = require("os");
import path = require("path");
import tar = require("tar");

import * as errors from "../src/utils/errors";
import {
    deploymentsPath,
    insertFixtures,
    models,
    storageClient
} from "./setup";

const contentPath = path.join(os.tmpdir(), "content");
const contentTargzPath = path.join(os.tmpdir(), "content.tar.gz");
let contentTargz: Buffer;
before(async () => {
    createTree(contentPath, {
        "index.html": "index.html",
        "index.js": "index.js"
    });
    await tar.create({ cwd: contentPath, file: contentTargzPath }, ["."]);
    contentTargz = await readFile(contentTargzPath);
});
after(() => {
    destroyTree(contentPath);
});

describe("DeploymentsClient.findOneById", () => {
    beforeEach(async () => {
        await insertFixtures({
            apps: [{ id: "1", name: "1" }],
            entrypoints: [{ id: "1", appId: "1", urlMatcher: "1" }],
            deployments: [{ id: "1", entrypointId: "1" }]
        });
    });
    it("if an deployment by the specified id exists, returns it as a pojo", async () => {
        const deployment = await storageClient.deployments.findOneById("1");
        expect(deployment).to.have.property("id", "1");
        expect(deployment).to.have.property("entrypointId", "1");
    });
    it("if an deployment by the specified id doesn't exist, returns null", async () => {
        const deployment = await storageClient.deployments.findOneById("2");
        expect(deployment).to.equal(null);
    });
});

describe("DeploymentsClient.findManyByEntrypointId", () => {
    beforeEach(async () => {
        await insertFixtures({
            apps: [{ id: "1", name: "1" }],
            entrypoints: [{ id: "1", appId: "1", urlMatcher: "1" }],
            deployments: [{ id: "1", entrypointId: "1" }]
        });
    });
    describe("returns all deployments with the specified entrypointId as pojo-s", () => {
        it("case: existing deployments with specified entrypointId", async () => {
            const deployments = await storageClient.deployments.findManyByEntrypointId(
                "1"
            );
            expect(deployments).to.have.length(1);
            expect(deployments[0]).to.have.property("id", "1");
            expect(deployments[0]).to.have.property("entrypointId", "1");
        });
        it("case: no existing deployments with specified entrypointId", async () => {
            const deployments = await storageClient.deployments.findManyByEntrypointId(
                "2"
            );
            expect(deployments).to.have.length(0);
        });
    });
});

describe("DeploymentsClient.findAll", () => {
    beforeEach(async () => {
        await insertFixtures({
            apps: [{ id: "1", name: "1" }],
            entrypoints: [{ id: "1", appId: "1", urlMatcher: "1" }],
            deployments: [{ id: "1", entrypointId: "1" }]
        });
    });
    it("returns all deployments as pojo-s", async () => {
        const deployments = await storageClient.deployments.findAll();
        expect(deployments).to.have.length(1);
        expect(deployments[0]).to.have.property("id", "1");
        expect(deployments[0]).to.have.property("entrypointId", "1");
    });
});

describe("DeploymentsClient.create", () => {
    beforeEach(async () => {
        await insertFixtures({
            apps: [{ id: "1", name: "1" }],
            entrypoints: [{ id: "1", appId: "1", urlMatcher: "1" }]
        });
    });
    it("throws an EntrypointNotFoundError if the deployment links to a non-existing entrypoint", async () => {
        const createPromise = storageClient.deployments.create({
            entrypointId: "2",
            content: contentTargz
        });
        await expect(createPromise).to.be.rejectedWith(
            errors.EntrypointNotFoundError
        );
        await expect(createPromise).to.be.rejectedWith(
            "No entrypoint found with id = 2"
        );
    });
    it("creates a deployment", async () => {
        await storageClient.deployments.create({
            entrypointId: "1",
            content: contentTargz
        });
        const deploymentInstance = await models.Deployment.findOne({
            where: { entrypointId: "1" }
        });
        expect(deploymentInstance).not.to.equal(null);
    });
    it("returns the created deployment as a pojo", async () => {
        const deployment = await storageClient.deployments.create({
            entrypointId: "1",
            content: contentTargz
        });
        expect(deployment).to.have.property("entrypointId", "1");
    });
    it("unpacks the deployment content", async () => {
        const deployment = await storageClient.deployments.create({
            entrypointId: "1",
            content: contentTargz
        });
        // Base folder
        const deploymentPath = path.join(deploymentsPath, deployment.id);
        expect(await pathExists(deploymentPath)).to.equal(true);
        // Targz content
        expect(
            await pathExists(path.join(deploymentPath, "content.tar.gz"))
        ).to.equal(true);
        // Root folder
        expect(await pathExists(path.join(deploymentPath, "root"))).to.equal(
            true
        );
        // Files
        const indexHtmlPath = path.join(deploymentPath, "root/index.html");
        expect(await pathExists(indexHtmlPath)).to.equal(true);
        expect(await readFile(indexHtmlPath, "utf8")).to.equal("index.html");
        const indexJsPath = path.join(deploymentPath, "root/index.js");
        expect(await pathExists(indexJsPath)).to.equal(true);
        expect(await readFile(indexJsPath, "utf8")).to.equal("index.js");
    });
});

describe("DeploymentsClient.delete", () => {
    beforeEach(async () => {
        await insertFixtures({
            apps: [{ id: "1", name: "1" }],
            entrypoints: [{ id: "1", appId: "1", urlMatcher: "1" }],
            deployments: [{ id: "1", entrypointId: "1" }]
        });
        await models.Entrypoint.update(
            { activeDeploymentId: "1" },
            { where: { id: "1" } }
        );
    });
    it("throws a DeploymentNotFoundError if no deployment with the specified id exists", async () => {
        const deletePromise = storageClient.deployments.delete("2");
        await expect(deletePromise).to.be.rejectedWith(
            errors.DeploymentNotFoundError
        );
        await expect(deletePromise).to.be.rejectedWith(
            "No deployment found with id = 2"
        );
    });
    it("deletes the deployment files", async () => {
        await storageClient.deployments.delete("1");
        const filesExist = await pathExists(path.join(deploymentsPath, "1"));
        expect(filesExist).to.equal(false);
    });
    it("deletes the deployment", async () => {
        await storageClient.deployments.delete("1");
        const deploymentInstance = await models.Deployment.findById("1");
        expect(deploymentInstance).to.equal(null);
    });
    it("null-ifies entrypoint links the deployment", async () => {
        await storageClient.deployments.delete("1");
        const entrypointInstance = await models.Entrypoint.findById("1");
        expect(entrypointInstance!.get("activeDeploymentId")).to.equal(null);
    });
});
