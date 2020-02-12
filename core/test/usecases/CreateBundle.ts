import { expect } from "chai";
import sinon from "sinon";

import {
    BundleFallbackAssetNotFoundError,
    BundleNameOrTagNotValidError
} from "../../src/common/functionalErrors";
import { Operation } from "../../src/entities/OperationLog";
import CreateBundle from "../../src/usecases/CreateBundle";
import { getMockDependencies } from "../testUtils";

describe("usecase CreateBundle", () => {
    it("throws BundleNameOrTagNotValidError if the name is not valid", async () => {
        const createBundle = new CreateBundle(getMockDependencies());
        const createBundlePromise = createBundle.exec({
            name: "*",
            tag: "tag",
            description: "description",
            content: Buffer.from(""),
            fallbackAssetPath: "/file",
            fallbackStatusCode: 200,
            headers: {}
        });
        await expect(createBundlePromise).to.be.rejectedWith(
            BundleNameOrTagNotValidError
        );
        await expect(createBundlePromise).to.be.rejectedWith(
            "* is not a valid name for a bundle"
        );
    });

    it("throws BundleNameOrTagNotValidError if the tag is not valid", async () => {
        const createBundle = new CreateBundle(getMockDependencies());
        const createBundlePromise = createBundle.exec({
            name: "name",
            tag: "*",
            description: "description",
            content: Buffer.from(""),
            fallbackAssetPath: "/file",
            fallbackStatusCode: 200,
            headers: {}
        });
        await expect(createBundlePromise).to.be.rejectedWith(
            BundleNameOrTagNotValidError
        );
        await expect(createBundlePromise).to.be.rejectedWith(
            "* is not a valid tag for a bundle"
        );
    });

    it("throws BundleFallbackAssetNotFoundError if the fallbackAssetPath doesn't have a corresponding asset", async () => {
        const deps = getMockDependencies();
        deps.archiver.extractFiles.resolves([]);
        const createBundle = new CreateBundle(deps);
        const createBundlePromise = createBundle.exec({
            name: "name",
            tag: "tag",
            description: "description",
            content: Buffer.from(""),
            fallbackAssetPath: "/non-existing",
            fallbackStatusCode: 200,
            headers: {}
        });
        await expect(createBundlePromise).to.be.rejectedWith(
            BundleFallbackAssetNotFoundError
        );
        await expect(createBundlePromise).to.be.rejectedWith(
            "Asset /non-existing not found in bundle, cannot be set as fallback asset"
        );
    });

    it("builds the bundle's assets from files extracted form the bundle's content", async () => {
        const deps = getMockDependencies();
        deps.archiver.extractFiles.resolves([
            { path: "/index.html", content: Buffer.from("index.html") },
            { path: "/index.js", content: Buffer.from("index.js") }
        ]);
        const createBundle = new CreateBundle(deps);
        await createBundle.exec({
            name: "name",
            tag: "tag",
            description: "description",
            content: Buffer.from(""),
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
        expect(deps.storages.bundles.createOne).to.have.callCount(1);
        expect(
            deps.storages.bundles.createOne.getCall(0).args[0].assets
        ).to.deep.equalInAnyOrder([
            {
                path: "/index.html",
                content: Buffer.from("index.html"),
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
                content: Buffer.from("index.js"),
                mimeType: "application/javascript",
                headers: {
                    "**/*": "**/*",
                    "**/*.js": "**/*.js",
                    "/index.js": "/index.js",
                    "!(/index.html)": "!(/index.html)"
                }
            }
        ]);
    });

    it("creates a bundle", async () => {
        const deps = getMockDependencies();
        deps.archiver.extractFiles.resolves([
            { path: "/file", content: Buffer.from("file") }
        ]);
        const createBundle = new CreateBundle(deps);
        await createBundle.exec({
            name: "name",
            tag: "tag",
            description: "description",
            content: Buffer.from(""),
            fallbackAssetPath: "/file",
            fallbackStatusCode: 200,
            headers: {}
        });
        expect(deps.storages.bundles.createOne).to.have.been.calledOnceWith({
            id: sinon.match.string,
            name: "name",
            tag: "tag",
            description: "description",
            hash: sinon.match.string,
            // Already tested above
            assets: sinon.match.any,
            fallbackAssetPath: "/file",
            fallbackStatusCode: 200,
            createdAt: sinon.match.date
        });
    });

    it("logs the create bundle operation", async () => {
        const deps = getMockDependencies();
        deps.archiver.extractFiles.resolves([
            { path: "/file", content: Buffer.from("file") }
        ]);
        const createBundle = new CreateBundle(deps);
        await createBundle.exec({
            name: "name",
            tag: "tag",
            description: "description",
            content: Buffer.from(""),
            fallbackAssetPath: "/file",
            fallbackStatusCode: 200,
            headers: {}
        });
        expect(
            deps.storages.operationLogs.createOne
        ).to.have.been.calledOnceWith(
            sinon.match.has("operation", Operation.CreateBundle)
        );
    });

    it("returns the created bundle", async () => {
        const deps = getMockDependencies();
        deps.archiver.extractFiles.resolves([
            { path: "/file", content: Buffer.from("file") }
        ]);
        const mockCreatedBundle = {} as any;
        deps.storages.bundles.createOne.resolves(mockCreatedBundle);
        const createBundle = new CreateBundle(deps);
        const createdBundle = await createBundle.exec({
            name: "name",
            tag: "tag",
            description: "description",
            content: Buffer.from(""),
            fallbackAssetPath: "/file",
            fallbackStatusCode: 200,
            headers: {}
        });
        expect(createdBundle).to.equal(mockCreatedBundle);
    });
});
