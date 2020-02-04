import { IStorages } from "@staticdeploy/core";
import { expect } from "chai";

export default (storages: IStorages) => {
    describe("ExternalCachesStorage", () => {
        it("create an externalCache and verify that one externalCache with its domain exists", async () => {
            await storages.externalCaches.createOne({
                id: "id",
                domain: "domain.com",
                type: "type",
                configuration: {},
                createdAt: new Date(),
                updatedAt: new Date()
            });
            const externalCacheExists = await storages.externalCaches.oneExistsWithDomain(
                "domain.com"
            );
            expect(externalCacheExists).to.equal(true);
        });

        it("check if one externalCache with a non-existing domain exists and get false", async () => {
            const externalCacheExists = await storages.externalCaches.oneExistsWithDomain(
                "domain.com"
            );
            expect(externalCacheExists).to.equal(false);
        });

        it("create an externalCache and find it by id", async () => {
            const externalCache = {
                id: "id",
                domain: "domain.com",
                type: "type",
                configuration: {},
                createdAt: new Date(),
                updatedAt: new Date()
            };
            await storages.externalCaches.createOne(externalCache);
            const foundExternalCache = await storages.externalCaches.findOne(
                "id"
            );
            expect(foundExternalCache).to.deep.equal(externalCache);
        });

        it("try to find an externalCache by a non-existing id and get null", async () => {
            const notFoundExternalCache = await storages.externalCaches.findOne(
                "id"
            );
            expect(notFoundExternalCache).to.equal(null);
        });

        it("create an externalCache and find it by domain", async () => {
            const externalCache = {
                id: "id",
                domain: "domain.com",
                type: "type",
                configuration: {},
                createdAt: new Date(),
                updatedAt: new Date()
            };
            await storages.externalCaches.createOne(externalCache);
            const foundExternalCache = await storages.externalCaches.findOneByDomain(
                "domain.com"
            );
            expect(foundExternalCache).to.deep.equal(externalCache);
        });

        it("try to find an externalCache by a non-existing name and get null", async () => {
            const notFoundExternalCache = await storages.externalCaches.findOneByDomain(
                "domain.com"
            );
            expect(notFoundExternalCache).to.equal(null);
        });

        it("create an externalCache and get it back when finding many", async () => {
            const externalCache = {
                id: "id",
                domain: "domain.com",
                type: "type",
                configuration: {},
                createdAt: new Date(),
                updatedAt: new Date()
            };
            await storages.externalCaches.createOne(externalCache);
            const foundExternalCaches = await storages.externalCaches.findMany();
            expect(foundExternalCaches).to.deep.equal([externalCache]);
        });

        describe("create many externalCaches and, finding them by id, get them back as expected", () => {
            it("case: configuration is an empty object", async () => {
                const externalCache = {
                    id: "id",
                    domain: "domain.com",
                    type: "type",
                    configuration: {},
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                await storages.externalCaches.createOne(externalCache);
                const foundExternalCache = await storages.externalCaches.findOne(
                    "id"
                );
                expect(foundExternalCache).to.deep.equal(externalCache);
            });

            it("case: configutation is a non-empty object", async () => {
                const externalCache = {
                    id: "id",
                    domain: "domain.com",
                    type: "type",
                    configuration: { key: "value" },
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                await storages.externalCaches.createOne(externalCache);
                const foundExternalCache = await storages.externalCaches.findOne(
                    "id"
                );
                expect(foundExternalCache).to.deep.equal(externalCache);
            });
        });

        it("create an externalCache, update it, and get back the updated version when finding it by id", async () => {
            await storages.externalCaches.createOne({
                id: "id",
                domain: "domain.com",
                type: "type",
                configuration: {},
                createdAt: new Date(),
                updatedAt: new Date()
            });
            await storages.externalCaches.updateOne("id", {
                configuration: { key: "value" },
                updatedAt: new Date()
            });
            const foundExternalCache = await storages.externalCaches.findOne(
                "id"
            );
            expect(foundExternalCache)
                .to.have.property("configuration")
                .that.deep.equals({ key: "value" });
        });

        it("create an externalCache, delete it, and verify it doesn't exist (anymore)", async () => {
            await storages.externalCaches.createOne({
                id: "id",
                domain: "domain.com",
                type: "type",
                configuration: {},
                createdAt: new Date(),
                updatedAt: new Date()
            });
            await storages.externalCaches.deleteOne("id");
            const externalCacheExists = await storages.externalCaches.oneExistsWithDomain(
                "domain.com"
            );
            expect(externalCacheExists).to.equal(false);
        });
    });
};
