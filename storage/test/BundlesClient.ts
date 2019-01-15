import { IBundle } from "@staticdeploy/common-types";
import { expect } from "chai";
import { sortBy } from "lodash";

import BundlesClient from "../src/BundlesClient";
import * as errors from "../src/utils/errors";
import { eq } from "../src/utils/sequelizeOperators";
import {
    insertFixtures,
    models,
    s3Bucket,
    s3Client,
    storageClient,
    targzOf
} from "./setup";

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

describe("BundlesClient.findNames", () => {
    beforeEach(async () => {
        await insertFixtures({
            bundles: [
                { id: "1", name: "1", tag: "1" },
                { id: "2", name: "2", tag: "2" }
            ]
        });
    });
    it("returns all bundles' names", async () => {
        const bundleNames = await storageClient.bundles.findNames();
        expect(bundleNames).to.deep.equal(["1", "2"]);
    });
});

describe("BundlesClient.findTagsByName", () => {
    beforeEach(async () => {
        await insertFixtures({
            bundles: [
                { id: "1", name: "1", tag: "1" },
                { id: "2", name: "1", tag: "2" }
            ]
        });
    });
    it("returns all tags of the bundles with the specified name", async () => {
        const bundleTags = await storageClient.bundles.findTagsByName("1");
        expect(bundleTags).to.deep.equal(["1", "2"]);
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

describe("BundlesClient.findAllByNameTagCombination", () => {
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
    it("returns all bundles (as pojo-s) matching the specified name:tag combination", async () => {
        const bundles = await storageClient.bundles.findAllByNameTagCombination(
            "1:1"
        );
        expect(bundles).to.have.length(2);
        expect(bundles[0]).to.have.property("id", "1");
        expect(bundles[1]).to.have.property("id", "2");
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
        await insertFixtures({});
    });
    it("throws a NameOrTagNotValidError if the passed in name is not valid", async () => {
        const createPromise = storageClient.bundles.create({
            name: "*",
            tag: "1",
            description: "1",
            content: targzOf({ file: "file" }),
            fallbackAssetPath: "/file",
            fallbackStatusCode: 200,
            headers: {}
        });
        await expect(createPromise).to.be.rejectedWith(
            errors.BundleNameOrTagNotValidError
        );
        await expect(createPromise).to.be.rejectedWith(
            "* is not a valid name for a bundle"
        );
    });
    it("throws a NameOrTagNotValidError if the passed in tag is not valid", async () => {
        const createPromise = storageClient.bundles.create({
            name: "1",
            tag: "*",
            description: "1",
            content: targzOf({ file: "file" }),
            fallbackAssetPath: "/file",
            fallbackStatusCode: 200,
            headers: {}
        });
        await expect(createPromise).to.be.rejectedWith(
            errors.BundleNameOrTagNotValidError
        );
        await expect(createPromise).to.be.rejectedWith(
            "* is not a valid tag for a bundle"
        );
    });
    it("throws a BundleFallbackAssetNotFound if the passed in fallbackAssetPath doesn't have a corresponding asset", async () => {
        const createPromise = storageClient.bundles.create({
            name: "1",
            tag: "1",
            description: "1",
            content: targzOf({ file: "file" }),
            fallbackAssetPath: "/non-existing",
            fallbackStatusCode: 200,
            headers: {}
        });
        await expect(createPromise).to.be.rejectedWith(
            errors.BundleFallbackAssetNotFound
        );
        await expect(createPromise).to.be.rejectedWith(
            "Asset /non-existing not found in bundle, cannot be set as fallback asset"
        );
    });
    it("creates a bundle", async () => {
        await storageClient.bundles.create({
            name: "1",
            tag: "1",
            description: "1",
            content: targzOf({ file: "file" }),
            fallbackAssetPath: "/file",
            fallbackStatusCode: 200,
            headers: {}
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
            content: targzOf({ file: "file" }),
            fallbackAssetPath: "/file",
            fallbackStatusCode: 200,
            headers: {}
        });
        const bundleInstance = await models.Bundle.findOne({
            where: { name: eq("1") }
        });
        expect(bundle).to.deep.equal(bundleInstance!.get());
    });
    it("unpacks and saves the bundle content to S3", async () => {
        const bundle = await storageClient.bundles.create({
            name: "1",
            tag: "1",
            description: "1",
            content: targzOf({
                "index.html": "index.html",
                "index.js": "index.js"
            }),
            fallbackAssetPath: "/index.html",
            fallbackStatusCode: 200,
            headers: {}
        });
        const indexHtmlObject = await s3Client
            .getObject({
                Bucket: s3Bucket,
                Key: `${bundle.id}/index.html`
            })
            .promise();
        expect(indexHtmlObject.Body!.toString()).to.equal("index.html");
        const indexJsObject = await s3Client
            .getObject({
                Bucket: s3Bucket,
                Key: `${bundle.id}/index.js`
            })
            .promise();
        expect(indexJsObject.Body!.toString()).to.equal("index.js");
    });
    it("builds the bundle's assets property from files in the bundle's content", async () => {
        const bundle = await storageClient.bundles.create({
            name: "1",
            tag: "1",
            description: "1",
            content: targzOf({
                "index.html": "index.html",
                "index.js": "index.js"
            }),
            fallbackAssetPath: "/index.html",
            fallbackStatusCode: 200,
            headers: {
                "**/*": { "**/*": "**/*" },
                "**/*.html": { "**/*.html": "**/*.html" },
                "**/*.js": { "**/*.js": "**/*.js" },
                "/index.html": { "/index.html": "/index.html" },
                "/index.js": { "/index.js": "/index.js" },
                "!(/index.html)": { "!(/index.html)": "!(/index.html)" },
                "!(/index.js)": { "!(/index.js)": "!(/index.js)" }
            }
        });
        expect(bundle).to.have.property("assets");
        expect(sortBy(bundle.assets, "path")).to.deep.equal(
            sortBy(
                [
                    {
                        path: "/index.html",
                        mimeType: "text/html",
                        headers: {
                            "**/*": "**/*",
                            "**/*.html": "**/*.html",
                            "/index.html": "/index.html",
                            "!(/index.js)": "!(/index.js)"
                        }
                    },
                    {
                        path: "/index.js",
                        mimeType: "application/javascript",
                        headers: {
                            "**/*": "**/*",
                            "**/*.js": "**/*.js",
                            "/index.js": "/index.js",
                            "!(/index.html)": "!(/index.html)"
                        }
                    }
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
    it("deletes the bundle files from S3", async () => {
        await storageClient.bundles.delete("2");
        const objects = await s3Client
            .listObjects({ Bucket: s3Bucket, Prefix: "2" })
            .promise();
        expect(objects.Contents).to.deep.equal([]);
    });
    it("deletes the bundle", async () => {
        await storageClient.bundles.delete("2");
        const bundleInstance = await models.Bundle.findByPk("2");
        expect(bundleInstance).to.equal(null);
    });
});

describe("BundlesClient.getBundleAssetContent", () => {
    let bundle: IBundle;
    before(async () => {
        await insertFixtures({});
        bundle = await storageClient.bundles.create({
            name: "1",
            tag: "1",
            description: "1",
            content: targzOf({ file: "file" }),
            fallbackAssetPath: "/file",
            fallbackStatusCode: 200,
            headers: {}
        });
    });
    it("throws a BundleNotFoundError if no bundle with the specified id exists", async () => {
        const getPromise = storageClient.bundles.getBundleAssetContent(
            "non-existing",
            "/index.html"
        );
        await expect(getPromise).to.be.rejectedWith(errors.BundleNotFoundError);
        await expect(getPromise).to.be.rejectedWith(
            "No bundle found with id = non-existing"
        );
    });
    it("throws a BundleAssetNotFoundError if no asset with the specified path exists", async () => {
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
        const content = await storageClient.bundles.getBundleAssetContent(
            bundle.id,
            "/file"
        );
        expect(content).to.deep.equal(Buffer.from("file"));
    });
});

describe("BundlesClient.splitNameTagCombination", () => {
    it("throws a NameTagCombinationNotValidError when passed in a non valid name:tag combination", () => {
        const troublemaker = () =>
            BundlesClient.splitNameTagCombination("non-valid");
        expect(troublemaker).to.throw(
            errors.BundleNameTagCombinationNotValidError
        );
        expect(troublemaker).to.throw(
            "non-valid is not a valid name:tag combination for a bundle"
        );
    });
    it("returns a [name, tag] tuple from the combination", () => {
        const tuple = BundlesClient.splitNameTagCombination("name:tag");
        expect(tuple).to.deep.equal(["name", "tag"]);
    });
});
