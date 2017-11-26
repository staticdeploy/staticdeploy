import { expect } from "chai";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import request = require("supertest");

import { JWT_SECRET } from "config";
import getApp from "getApp";
import insertFixtures from "../../../insertFixtures";

describe("api GET /entrypoints/:entrypointId", () => {
    let server: Express;
    const token = sign({ sub: "sub" }, JWT_SECRET);

    before(async () => {
        server = await getApp();
        await insertFixtures({
            apps: [{ id: "1", name: "1" }],
            entrypoints: [{ id: "1", appId: "1", urlMatcher: "1" }]
        });
    });

    it("404 on entrypoint not found", () => {
        return request(server)
            .get("/entrypoints/2")
            .set("Authorization", `Bearer ${token}`)
            .expect(404);
    });

    it("200 and returns the entrypoint", async () => {
        const response = await request(server)
            .get("/entrypoints/1")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(response.body).to.have.property("urlMatcher", "1");
    });
});
