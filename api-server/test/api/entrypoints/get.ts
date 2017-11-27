import { expect } from "chai";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import request = require("supertest");

import { JWT_SECRET } from "config";
import getApp from "getApp";
import Entrypoint from "models/Entrypoint";
import insertFixtures from "../../insertFixtures";

describe("api GET /entrypoints", () => {
    let server: Express;
    const token = sign({ sub: "sub" }, JWT_SECRET);

    beforeEach(async () => {
        server = await getApp();
        await insertFixtures({
            apps: [{ id: "1", name: "1" }, { id: "2", name: "2" }],
            entrypoints: [
                { id: "1", appId: "1", urlMatcher: "1" },
                { id: "2", appId: "2", urlMatcher: "2" }
            ]
        });
    });

    it("404 on non-existing filter app", () => {
        return request(server)
            .get("/entrypoints?appIdOrName=3")
            .set("Authorization", `Bearer ${token}`)
            .expect(404);
    });

    it("filters entrypoints by appIdOrName", async () => {
        const response = await request(server)
            .get("/entrypoints?appIdOrName=1")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(response.body).to.have.length(1);
        expect(
            response.body.map((entrypoint: Entrypoint) => entrypoint.id)
        ).to.deep.equal(["1"]);
    });

    it("200 and returns all entrypoints", async () => {
        const response = await request(server)
            .get("/entrypoints")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(response.body).to.have.length(2);
        expect(
            response.body.map((entrypoint: Entrypoint) => entrypoint.id)
        ).to.deep.equal(["1", "2"]);
    });
});
