import { expect } from "chai";
import nock from "nock";

import StaticdeployClient from "../src";

const baseUrl = "http://localhost";
const staticdeployClient = new StaticdeployClient({ apiUrl: baseUrl });
const unixEpoch = new Date(0);
const unixEpochISO = unixEpoch.toISOString();

beforeEach(() => {
    nock.cleanAll();
});

describe("BundlesClient", () => {
    describe("getAll", () => {
        it("requests GET /bundles", async () => {
            const scope = nock(baseUrl)
                .get("/bundles")
                .reply(200, []);
            await staticdeployClient.bundles.getAll();
            scope.done();
        });
        it("returns a list of bundles", async () => {
            nock(baseUrl)
                .get("/bundles")
                .reply(200, []);
            const bundles = await staticdeployClient.bundles.getAll();
            expect(bundles).to.deep.equal([]);
        });
        it("inflates dates", async () => {
            nock(baseUrl)
                .get("/bundles")
                .reply(200, [{ createdAt: unixEpochISO }]);
            const bundles = await staticdeployClient.bundles.getAll();
            expect(bundles).to.deep.equal([{ createdAt: unixEpoch }]);
        });
    });

    describe("getOne", () => {
        it("requests GET /bundle/:bundleId", async () => {
            const scope = nock(baseUrl)
                .get("/bundles/id")
                .reply(200);
            await staticdeployClient.bundles.getOne("id");
            scope.done();
        });
        it("returns the bundle with the specified id", async () => {
            nock(baseUrl)
                .get("/bundles/id")
                .reply(200, {});
            const bundle = await staticdeployClient.bundles.getOne("id");
            expect(bundle).to.deep.equal({});
        });
        it("inflates dates", async () => {
            nock(baseUrl)
                .get("/bundles/id")
                .reply(200, { createdAt: unixEpochISO });
            const bundle = await staticdeployClient.bundles.getOne("id");
            expect(bundle).to.deep.equal({ createdAt: unixEpoch });
        });
    });

    describe("create", () => {
        it("requests POST /bundles", async () => {
            const scope = nock(baseUrl)
                .post("/bundles", {
                    name: "name",
                    tag: "tag",
                    description: "description",
                    content: "content",
                    fallbackAssetPath: "/fallback",
                    fallbackStatusCode: 200,
                    headers: {}
                })
                .reply(201);
            await staticdeployClient.bundles.create({
                name: "name",
                tag: "tag",
                description: "description",
                content: "content",
                fallbackAssetPath: "/fallback",
                fallbackStatusCode: 200,
                headers: {}
            });
            scope.done();
        });
        it("returns the created bundle", async () => {
            nock(baseUrl)
                .post("/bundles")
                .reply(201, {});
            const bundle = await staticdeployClient.bundles.create({
                name: "name",
                tag: "tag",
                description: "description",
                content: "content",
                fallbackAssetPath: "/fallback",
                fallbackStatusCode: 200,
                headers: {}
            });
            expect(bundle).to.deep.equal({});
        });
        it("inflates dates", async () => {
            nock(baseUrl)
                .post("/bundles")
                .reply(201, { createdAt: unixEpochISO });
            const bundle = await staticdeployClient.bundles.create({
                name: "name",
                tag: "tag",
                description: "description",
                content: "content",
                fallbackAssetPath: "/fallback",
                fallbackStatusCode: 200,
                headers: {}
            });
            expect(bundle).to.deep.equal({ createdAt: unixEpoch });
        });
    });

    describe("delete", () => {
        it("requests DELETE /bundles/:bundleId", async () => {
            const scope = nock(baseUrl)
                .delete("/bundles/id")
                .reply(204);
            await staticdeployClient.bundles.delete("id");
            scope.done();
        });
    });
});
