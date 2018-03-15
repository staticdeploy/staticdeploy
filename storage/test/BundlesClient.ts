import { expect } from "chai";
import { createTree, destroyTree, IDefinition } from "create-fs-tree";
import { pathExists, removeSync } from "fs-extra";
import { sortBy } from "lodash";
import { readFile, readFileSync } from "mz/fs";
import path from "path";
import tar from "tar";

import * as errors from "../src/utils/errors";
import { eq } from "../src/utils/sequelizeOperators";
import {
    baseTestsPath,
    bundlesPath,
    insertFixtures,
    models,
    storageClient
} from "./setup";

function targzOf(definition: IDefinition): Buffer {
    const contentPath = path.join(baseTestsPath, "content");
    const contentTargzPath = path.join(baseTestsPath, "content.tar.gz");
    createTree(contentPath, definition);
    tar.create({ cwd: contentPath, file: contentTargzPath, sync: true }, ["."]);
    destroyTree(contentPath);
    const contentTargz = readFileSync(contentTargzPath);
    removeSync(contentTargzPath);
    return contentTargz;
}

describe("BundlesClient.findOneById", () => {
    beforeEach(async () => {
        await insertFixtures({
            bundles: [{ id: "1", name: "1", tag: "1" }]
        });
    });
    it("if a bundle with the specified id doesn't exist, returns null", async () => {
        const bundle = await storageClient.bundles.findOneById("2");
        expect(bundle).to.equal(null);
    });
    it("returns the found bundle as a pojo", async () => {
        const bundle = await storageClient.bundles.findOneById("1");
        expect(bundle).to.have.property("id", "1");
        expect(bundle).to.have.property("name", "1");
    });
});

describe("BundlesClient.findLatestByNameTagCombination", () => {
    beforeEach(async () => {
        await insertFixtures({
            bundles: [
                {
                    id: "1",
                    name: "1",
                    tag: "1",
                    createdAt: new Date("1970-01-01")
                },
                {
                    id: "2",
                    name: "1",
                    tag: "1",
                    createdAt: new Date("1970-01-02")
                }
            ]
        });
    });
    it("if a bundle with the specified name:tag doesn't exist, returns null", async () => {
        const bundle = await storageClient.bundles.findLatestByNameTagCombination(
            "2:2"
        );
        expect(bundle).to.equal(null);
    });
    it("returns the latest bundle with the specified name:tag combination as a pojo", async () => {
        const bundle = await storageClient.bundles.findLatestByNameTagCombination(
            "1:1"
        );
        expect(bundle).to.have.property("id", "2");
    });
});

describe("BundlesClient.findAll", () => {
    beforeEach(async () => {
        await insertFixtures({
            bundles: [
                { id: "1", name: "1", tag: "1" },
                { id: "2", name: "1", tag: "1" }
            ]
        });
    });
    it("returns all bundles as pojo-s", async () => {
        const bundles = await storageClient.bundles.findAll();
        expect(bundles).to.have.length(2);
        expect(bundles[0]).to.have.property("id", "1");
        expect(bundles[1]).to.have.property("id", "2");
    });
});

describe("BundlesClient.create", () => {
    beforeEach(async () => {
        await insertFixtures({ bundles: [] });
    });
    it("creates a bundle", async () => {
        await storageClient.bundles.create({
            name: "1",
            tag: "1",
            description: "1",
            content: targzOf({
                "index.html": "index.html",
                "index.js": "index.js"
            })
        });
        const bundleInstance = await models.Bundle.findOne({
            where: { name: eq("1") }
        });
        expect(bundleInstance).not.to.equal(null);
    });
    it("returns the created bundle as a pojo", async () => {
        const bundle = await storageClient.bundles.create({
            name: "1",
            tag: "1",
            description: "1",
            content: targzOf({
                "index.html": "index.html",
                "index.js": "index.js"
            })
        });
        const bundleInstance = await models.Bundle.findOne({
            where: { name: eq("1") }
        });
        expect(bundle).to.deep.equal(bundleInstance!.get());
    });
    it("unpacks and saves the bundle content to the filesystem", async () => {
        const bundle = await storageClient.bundles.create({
            name: "1",
            tag: "1",
            description: "1",
            content: targzOf({
                "index.html": "index.html",
                "index.js": "index.js"
            })
        });
        // Base folder
        const bundlePath = path.join(bundlesPath, bundle.id);
        expect(await pathExists(bundlePath)).to.equal(true);
        // Targz content
        expect(
            await pathExists(path.join(bundlePath, "content.tar.gz"))
        ).to.equal(true);
        // Root folder
        expect(await pathExists(path.join(bundlePath, "root"))).to.equal(true);
        // Files
        const indexHtmlPath = path.join(bundlePath, "root/index.html");
        expect(await pathExists(indexHtmlPath)).to.equal(true);
        expect(await readFile(indexHtmlPath, "utf8")).to.equal("index.html");
        const indexJsPath = path.join(bundlePath, "root/index.js");
        expect(await pathExists(indexJsPath)).to.equal(true);
        expect(await readFile(indexJsPath, "utf8")).to.equal("index.js");
    });
    it("builds the bundle's property assets from files in the bundle's content", async () => {
        const bundle = await storageClient.bundles.create({
            name: "1",
            tag: "1",
            description: "1",
            content: targzOf({
                "index.html": "index.html",
                "index.js": "index.js"
            })
        });
        expect(bundle).to.have.property("assets");
        expect(sortBy(bundle.assets, "path")).to.deep.equal(
            sortBy(
                [
                    { path: "/index.html", mimeType: "text/html" },
                    { path: "/index.js", mimeType: "application/javascript" }
                ],
                "path"
            )
        );
    });
});

describe("BundlesClient.delete", () => {
    beforeEach(async () => {
        await insertFixtures({
            apps: [{ id: "1", name: "1" }],
            entrypoints: [
                { id: "1", appId: "1", bundleId: "1", urlMatcher: "1.com/" }
            ],
            bundles: [
                { id: "1", name: "1", tag: "1" },
                { id: "2", name: "2", tag: "2" }
            ]
        });
    });
    it("throws a BundleNotFoundError if no bundle with the specified id exists", async () => {
        const deletePromise = storageClient.bundles.delete("3");
        await expect(deletePromise).to.be.rejectedWith(
            errors.BundleNotFoundError
        );
        await expect(deletePromise).to.be.rejectedWith(
            "No bundle found with id = 3"
        );
    });
    it("throws a BundleInUseError if the bundle is being use by some entrypoint", async () => {
        const deletePromise = storageClient.bundles.delete("1");
        await expect(deletePromise).to.be.rejectedWith(errors.BundleInUseError);
        await expect(deletePromise).to.be.rejectedWith(
            "Can't delete bundle with id = 1 as it's being used by entrypoints with ids = 1"
        );
    });
    it("deletes the bundle files", async () => {
        await storageClient.bundles.delete("2");
        const filesExist = await pathExists(path.join(bundlesPath, "2"));
        expect(filesExist).to.equal(false);
    });
    it("deletes the bundle", async () => {
        await storageClient.bundles.delete("2");
        const bundleInstance = await models.Bundle.findById("2");
        expect(bundleInstance).to.equal(null);
    });
});

describe("BundlesClient.getBundleAssetContent", () => {
    beforeEach(async () => {
        await insertFixtures({ bundles: [] });
    });
    it("throws a BundleNotFoundError if no bundle with the specified id exists", async () => {
        const getPromise = storageClient.bundles.getBundleAssetContent(
            "1",
            "/index.html"
        );
        await expect(getPromise).to.be.rejectedWith(errors.BundleNotFoundError);
        await expect(getPromise).to.be.rejectedWith(
            "No bundle found with id = 1"
        );
    });
    it("throws a BundleAssetNotFoundError if no asset at the specified path exists", async () => {
        const bundle = await storageClient.bundles.create({
            name: "1",
            tag: "1",
            description: "1",
            content: targzOf({ file: "file" })
        });
        const getPromise = storageClient.bundles.getBundleAssetContent(
            bundle.id,
            "/non-existing"
        );
        await expect(getPromise).to.be.rejectedWith(
            errors.BundleAssetNotFoundError
        );
        await expect(getPromise).to.be.rejectedWith(
            `No asset found at path = /non-existing for bundle with id = ${
                bundle.id
            }`
        );
    });
    it("returns the content of the asset", async () => {
        const bundle = await storageClient.bundles.create({
            name: "1",
            tag: "1",
            description: "1",
            content: targzOf({ file: "file" })
        });
        const content = await storageClient.bundles.getBundleAssetContent(
            bundle.id,
            "/file"
        );
        expect(content).to.deep.equal(Buffer.from("file"));
    });
});
