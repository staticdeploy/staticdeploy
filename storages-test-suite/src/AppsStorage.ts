import { IStorages } from "@staticdeploy/core";
import { expect } from "chai";

export default (storages: IStorages) => {
    describe("AppsStorage", () => {
        it("create an app and verify that one app with its id exists", async () => {
            await storages.apps.createOne({
                id: "id",
                name: "name",
                defaultConfiguration: {},
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            const appExists = await storages.apps.oneExistsWithId("id");
            expect(appExists).to.equal(true);
        });

        it("check if one app with a non-existing id exists and get false", async () => {
            const appExists = await storages.apps.oneExistsWithId("id");
            expect(appExists).to.equal(false);
        });

        it("create an app and verify that one app with its name exists", async () => {
            await storages.apps.createOne({
                id: "id",
                name: "name",
                defaultConfiguration: {},
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            const appExists = await storages.apps.oneExistsWithName("name");
            expect(appExists).to.equal(true);
        });

        it("check if one app with a non-existing name exists and get false", async () => {
            const appExists = await storages.apps.oneExistsWithName("name");
            expect(appExists).to.equal(false);
        });

        it("create an app and find it by id", async () => {
            const app = {
                id: "id",
                name: "name",
                defaultConfiguration: {},
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            await storages.apps.createOne(app);
            const foundApp = await storages.apps.findOne("id");
            expect(foundApp).to.deep.equal(app);
        });

        it("try to find an app by a non-existing id and get null", async () => {
            const notFoundApp = await storages.apps.findOne("id");
            expect(notFoundApp).to.equal(null);
        });

        it("create an app and find it by name", async () => {
            const app = {
                id: "id",
                name: "name",
                defaultConfiguration: {},
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            await storages.apps.createOne(app);
            const foundApp = await storages.apps.findOneByName("name");
            expect(foundApp).to.deep.equal(app);
        });

        it("try to find an app by a non-existing name and get null", async () => {
            const notFoundApp = await storages.apps.findOneByName("name");
            expect(notFoundApp).to.equal(null);
        });

        it("create an app and get it back when finding many", async () => {
            const app = {
                id: "id",
                name: "name",
                defaultConfiguration: {},
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            await storages.apps.createOne(app);
            const foundApps = await storages.apps.findMany();
            expect(foundApps).to.deep.equal([app]);
        });

        describe("create many apps and, finding them by id, get them back as expected", () => {
            it("case: defaultConfiguration is an empty object", async () => {
                const app = {
                    id: "id",
                    name: "name",
                    defaultConfiguration: {},
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                await storages.apps.createOne(app);
                const foundApp = await storages.apps.findOne("id");
                expect(foundApp).to.deep.equal(app);
            });

            it("case: defaultConfiguration is a non-empty object", async () => {
                const app = {
                    id: "id",
                    name: "name",
                    defaultConfiguration: { key: "value" },
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                await storages.apps.createOne(app);
                const foundApp = await storages.apps.findOne("id");
                expect(foundApp).to.deep.equal(app);
            });
        });

        it("create an app, update it, and get back the updated version when finding it by id", async () => {
            await storages.apps.createOne({
                id: "id",
                name: "name",
                defaultConfiguration: {},
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            await storages.apps.updateOne("id", {
                defaultConfiguration: { key: "value" },
                updatedAt: new Date(),
            });
            const foundApp = await storages.apps.findOne("id");
            expect(foundApp)
                .to.have.property("defaultConfiguration")
                .that.deep.equals({ key: "value" });
        });

        it("create an app, delete it, and verify it doesn't exist (anymore)", async () => {
            await storages.apps.createOne({
                id: "id",
                name: "name",
                defaultConfiguration: {},
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            await storages.apps.deleteOne("id");
            const appExists = await storages.apps.oneExistsWithId("id");
            expect(appExists).to.equal(false);
        });
    });
};
