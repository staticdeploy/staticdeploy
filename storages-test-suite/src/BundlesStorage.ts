import { IBundle, IStorages } from "@staticdeploy/core";
import { expect } from "chai";
import { omit } from "lodash";

function removeAssetsContent(bundle: IBundle): IBundle {
    return {
        ...bundle,
        assets: bundle.assets.map((asset) => omit(asset, "content")),
    };
}

export default (storages: IStorages) => {
    describe("BundlesStorage", () => {
        it("create a bundle and verify that one bundle with its id exists", async () => {
            await storages.bundles.createOne({
                id: "id",
                name: "name",
                tag: "tag",
                description: "description",
                hash: "hash",
                assets: [],
                fallbackAssetPath: "/file",
                fallbackStatusCode: 200,
                createdAt: new Date(),
            });
            const bundleExists = await storages.bundles.oneExistsWithId("id");
            expect(bundleExists).to.equal(true);
        });

        it("check if one bundle with a non-existing id exists and get false", async () => {
            const bundleExists = await storages.bundles.oneExistsWithId("id");
            expect(bundleExists).to.equal(false);
        });

        it("create a bundle and find it by id", async () => {
            const bundle = {
                id: "id",
                name: "name",
                tag: "tag",
                description: "description",
                hash: "hash",
                assets: [],
                fallbackAssetPath: "/file",
                fallbackStatusCode: 200,
                createdAt: new Date(),
            };
            await storages.bundles.createOne(bundle);
            const foundBundle = await storages.bundles.findOne("id");
            expect(foundBundle).to.deep.equal(removeAssetsContent(bundle));
        });

        it("try to find a bundle by a non-existing id and get null", async () => {
            const notFoundBundle = await storages.bundles.findOne("id");
            expect(notFoundBundle).to.equal(null);
        });

        it("create many bundles with the same name and tag, and find the latest by name and tag", async () => {
            const base = {
                name: "name",
                tag: "tag",
                description: "description",
                hash: "hash",
                assets: [],
                fallbackAssetPath: "/file",
                fallbackStatusCode: 200,
            };
            const bundles = [
                { ...base, id: "id0", createdAt: new Date("1970-01-01") },
                // id1 is the latest
                { ...base, id: "id1", createdAt: new Date("1970-01-03") },
                { ...base, id: "id2", createdAt: new Date("1970-01-02") },
            ];
            for (const bundle of bundles) {
                await storages.bundles.createOne(bundle);
            }
            const foundBundle = await storages.bundles.findLatestByNameAndTag(
                "name",
                "tag"
            );
            expect(foundBundle).to.have.property("id", "id1");
        });

        it("try to find a bundle by a non-existing name:tag combination and get null", async () => {
            const notFoundBundle = await storages.bundles.findLatestByNameAndTag(
                "name",
                "tag"
            );
            expect(notFoundBundle).to.equal(null);
        });

        it("create a bundle and retrieve one of its assets by path", async () => {
            await storages.bundles.createOne({
                id: "id",
                name: "name",
                tag: "tag",
                description: "description",
                hash: "hash",
                assets: [
                    {
                        path: "/file",
                        content: Buffer.from("content"),
                        mimeType: "text/plain",
                        headers: {},
                    },
                ],
                fallbackAssetPath: "/file",
                fallbackStatusCode: 200,
                createdAt: new Date(),
            });
            const content = await storages.bundles.getBundleAssetContent(
                "id",
                "/file"
            );
            expect(content).to.deep.equal(Buffer.from("content"));
        });

        describe("retrieve a non-existing bundle asset and get null", () => {
            it("case: non-existing bundle", async () => {
                const notFountContent = await storages.bundles.getBundleAssetContent(
                    "id",
                    "/file"
                );
                expect(notFountContent).to.equal(null);
            });

            it("case: existing bundle, non-existing asset", async () => {
                await storages.bundles.createOne({
                    id: "id",
                    name: "name",
                    tag: "tag",
                    description: "description",
                    hash: "hash",
                    assets: [],
                    fallbackAssetPath: "/file",
                    fallbackStatusCode: 200,
                    createdAt: new Date(),
                });
                const notFountContent = await storages.bundles.getBundleAssetContent(
                    "id",
                    "/file"
                );
                expect(notFountContent).to.equal(null);
            });
        });

        it("create a bundle and get it back with stripped properties when finding many", async () => {
            const bundle = {
                id: "id",
                name: "name",
                tag: "tag",
                description: "description",
                hash: "hash",
                assets: [],
                fallbackAssetPath: "/file",
                fallbackStatusCode: 200,
                createdAt: new Date(),
            };
            await storages.bundles.createOne(bundle);
            const foundBundles = await storages.bundles.findMany();
            expect(foundBundles).to.deep.equal([
                omit(bundle, [
                    "assets",
                    "description",
                    "fallbackAssetPath",
                    "fallbackStatusCode",
                    "hash",
                ]),
            ]);
        });

        it("create a bundle and get it back when finding many by name and tag", async () => {
            const bundle = {
                id: "id",
                name: "name",
                tag: "tag",
                description: "description",
                hash: "hash",
                assets: [],
                fallbackAssetPath: "/file",
                fallbackStatusCode: 200,
                createdAt: new Date(),
            };
            await storages.bundles.createOne(bundle);
            const foundBundles = await storages.bundles.findManyByNameAndTag(
                "name",
                "tag"
            );
            expect(foundBundles).to.deep.equal([removeAssetsContent(bundle)]);
        });

        it("create some bundles and get back their names when finding many names", async () => {
            const base = {
                tag: "tag",
                description: "description",
                hash: "hash",
                assets: [],
                fallbackAssetPath: "/file",
                fallbackStatusCode: 200,
                createdAt: new Date(),
            };
            const bundles = [
                { ...base, id: "id0", name: "name0" },
                { ...base, id: "id1", name: "name1" },
                { ...base, id: "id2", name: "name2" },
            ];
            for (const bundle of bundles) {
                await storages.bundles.createOne(bundle);
            }
            const foundNames = await storages.bundles.findManyNames();
            expect(foundNames.sort()).to.deep.equal(
                ["name0", "name1", "name2"].sort()
            );
        });

        it("create some bundles and get back their tags when finding many tags by name", async () => {
            const base = {
                name: "name",
                description: "description",
                hash: "hash",
                assets: [],
                fallbackAssetPath: "/file",
                fallbackStatusCode: 200,
                createdAt: new Date(),
            };
            const bundles = [
                { ...base, id: "id0", tag: "tag0" },
                { ...base, id: "id1", tag: "tag1" },
                { ...base, id: "id2", tag: "tag2" },
            ];
            for (const bundle of bundles) {
                await storages.bundles.createOne(bundle);
            }
            const foundTags = await storages.bundles.findManyTagsByName("name");
            expect(foundTags.sort()).to.deep.equal(
                ["tag0", "tag1", "tag2"].sort()
            );
        });

        it("create a bundle and, finding it by id, get it back as expected (without assets contents)", async () => {
            const bundle: IBundle = {
                id: "id",
                name: "name",
                tag: "tag",
                description: "description",
                hash: "hash",
                assets: [
                    {
                        path: "/file/0",
                        content: Buffer.from("/file/0"),
                        mimeType: "text/plain",
                        headers: {},
                    },
                    {
                        path: "/file/1",
                        content: Buffer.from("/file/1"),
                        mimeType: "text/plain",
                        headers: { key: "value" },
                    },
                ],
                fallbackAssetPath: "/file/0",
                fallbackStatusCode: 200,
                createdAt: new Date(),
            };
            await storages.bundles.createOne(bundle as any);
            const foundBundle = await storages.bundles.findOne("id");
            // We leave storages the possibility to either not-set
            // asset.content, or set it to undefined (the two things are
            // functionally the same). Chai's deep equal considers not-set and
            // undefined to be different, and since removeAssetsContent un-sets
            // asset.content, this test would fail for implementations that set
            // it to undefined. JSON stringification allows us to check for
            // equality not caring for the not-set/undefined difference. We
            // should employ this strategy for the other tests as well, but
            // since this test is the only one that runs into this problem for
            // now, we do it just here
            expect(JSON.stringify(foundBundle)).to.equal(
                JSON.stringify(removeAssetsContent(bundle))
            );
        });

        it("create a bundle and retrieve its assets contents as expected", async () => {
            const bundle = {
                id: "id",
                name: "name",
                tag: "tag",
                description: "description",
                hash: "hash",
                assets: [
                    {
                        path: "/file/0",
                        content: Buffer.from("/file/0"),
                        mimeType: "text/plain",
                        headers: {},
                    },
                    {
                        path: "/file/1",
                        content: Buffer.from("/file/1"),
                        mimeType: "text/plain",
                        headers: {},
                    },
                ],
                fallbackAssetPath: "/file/0",
                fallbackStatusCode: 200,
                createdAt: new Date(),
            };
            await storages.bundles.createOne(bundle as any);
            const file0Content = await storages.bundles.getBundleAssetContent(
                "id",
                "/file/0"
            );
            expect(file0Content).to.deep.equal(Buffer.from("/file/0"));
            const file1Content = await storages.bundles.getBundleAssetContent(
                "id",
                "/file/1"
            );
            expect(file1Content).to.deep.equal(Buffer.from("/file/1"));
        });

        it("create a bundle, delete it by id-s, and verify it doesn't exist (anymore)", async () => {
            await storages.bundles.createOne({
                id: "id",
                name: "name",
                tag: "tag",
                description: "description",
                hash: "hash",
                assets: [],
                fallbackAssetPath: "/file",
                fallbackStatusCode: 200,
                createdAt: new Date(),
            });
            await storages.bundles.deleteMany(["id"]);
            const bundleExists = await storages.bundles.oneExistsWithId("id");
            expect(bundleExists).to.equal(false);
        });
    });
};
