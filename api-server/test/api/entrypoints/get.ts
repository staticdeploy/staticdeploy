import { expect } from "chai";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import request = require("supertest");

import { JWT_SECRET } from "config";
import getApp from "getApp";
import storage from "services/storage";
import { IIds, insertFixtures } from "../../setup";

describe("api GET /entrypoints", () => {
    let server: Express;
    const token = sign({ sub: "sub" }, JWT_SECRET);
    let ids: IIds;

    beforeEach(async () => {
        server = await getApp();
        ids = await insertFixtures({
            apps: [{ name: "0" }, { name: "1" }],
            entrypoints: [
                { appId: "$0", urlMatcher: "0.com/" },
                { appId: "$1", urlMatcher: "1.com/" }
            ]
        });
    });

    it("404 on non-existing filter app", () => {
        return request(server)
            .get("/entrypoints?appIdOrName=2")
            .set("Authorization", `Bearer ${token}`)
            .expect(404);
    });

    describe("filters entrypoints by appIdOrName", () => {
        it("case: filter by id", async () => {
            const appId = ids.apps[0];
            const entrypointId = ids.entrypoints[0];
            const entrypoint = await storage.entrypoints.findOneById(
                entrypointId
            );
            const response = await request(server)
                .get(`/entrypoints?appIdOrName=${appId}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(200);
            expect(response.body).to.be.jsonOf([entrypoint]);
        });
        it("case: filter by name", async () => {
            const appName = "0";
            const entrypointId = ids.entrypoints[0];
            const entrypoint = await storage.entrypoints.findOneById(
                entrypointId
            );
            const response = await request(server)
                .get(`/entrypoints?appIdOrName=${appName}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(200);
            expect(response.body).to.be.jsonOf([entrypoint]);
        });
    });

    it("200 and returns all entrypoints", async () => {
        const entrypoints = await storage.entrypoints.findAll();
        const response = await request(server)
            .get("/entrypoints")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(response.body).to.be.jsonOf(entrypoints);
    });
});
