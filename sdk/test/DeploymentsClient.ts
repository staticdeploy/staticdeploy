import Axios from "axios";
import { expect } from "chai";
import nock from "nock";

import DeploymentsClient from "../src/DeploymentsClient";

const baseUrl = "http://localhost";
const axios = Axios.create({ baseURL: baseUrl });
const deploymentsClient = new DeploymentsClient(axios);
const unixEpoch = new Date(0);
const unixEpochISO = unixEpoch.toISOString();

beforeEach(() => {
    nock.cleanAll();
});

describe("DeploymentsClient", () => {
    describe("getAll", () => {
        it("requests GET /deployments", async () => {
            const scope = nock(baseUrl)
                .get("/deployments")
                .reply(200, []);
            await deploymentsClient.getAll();
            scope.done();
        });
        it("optionally sets a filter on the request with querystrig parameter ?entrypointIdOrUrlMatcher", async () => {
            const scope = nock(baseUrl)
                .get("/deployments?entrypointIdOrUrlMatcher=value")
                .reply(200, []);
            await deploymentsClient.getAll({
                entrypointIdOrUrlMatcher: "value"
            });
            scope.done();
        });
        it("returns a list of deployments", async () => {
            nock(baseUrl)
                .get("/deployments")
                .reply(200, []);
            const deployments = await deploymentsClient.getAll();
            expect(deployments).to.deep.equal([]);
        });
        it("inflates dates", async () => {
            nock(baseUrl)
                .get("/deployments")
                .reply(200, [{ createdAt: unixEpochISO }]);
            const deployments = await deploymentsClient.getAll();
            expect(deployments).to.deep.equal([{ createdAt: unixEpoch }]);
        });
    });

    describe("create", () => {
        it("requests POST /deployments", async () => {
            const scope = nock(baseUrl)
                .post("/deployments", {
                    entrypointIdOrUrlMatcher: "entrypointIdOrUrlMatcher",
                    content: "content"
                })
                .reply(201);
            await deploymentsClient.create({
                entrypointIdOrUrlMatcher: "entrypointIdOrUrlMatcher",
                content: "content"
            });
            scope.done();
        });
        it("returns the created deployment", async () => {
            nock(baseUrl)
                .post("/deployments", {
                    entrypointIdOrUrlMatcher: "entrypointIdOrUrlMatcher",

                    content: "content"
                })
                .reply(201, {});
            const deployment = await deploymentsClient.create({
                entrypointIdOrUrlMatcher: "entrypointIdOrUrlMatcher",
                content: "content"
            });
            expect(deployment).to.deep.equal({});
        });
        it("inflates dates", async () => {
            nock(baseUrl)
                .post("/deployments", {
                    entrypointIdOrUrlMatcher: "entrypointIdOrUrlMatcher",
                    content: "content"
                })
                .reply(201, { createdAt: unixEpochISO });
            const deployment = await deploymentsClient.create({
                entrypointIdOrUrlMatcher: "entrypointIdOrUrlMatcher",
                content: "content"
            });
            expect(deployment).to.deep.equal({ createdAt: unixEpoch });
        });
    });

    describe("delete", () => {
        it("requests DELETE /deployments/:deploymentId", async () => {
            const scope = nock(baseUrl)
                .delete("/deployments/id")
                .reply(204);
            await deploymentsClient.delete("id");
            scope.done();
        });
    });
});
