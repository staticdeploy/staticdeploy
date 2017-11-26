import { expect } from "chai";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import request = require("supertest");

import { JWT_SECRET } from "config";
import getApp from "getApp";
import insertFixtures from "../../../insertFixtures";

describe("api PATCH /entrypoints/:entrypointId", () => {
    let server: Express;
    const token = sign({ sub: "sub" }, JWT_SECRET);

    before(async () => {
        server = await getApp();
        await insertFixtures({
            apps: [{ id: "1", name: "1" }],
            entrypoints: [
                { id: "1", appId: "1", urlMatcher: "1" },
                { id: "2", appId: "1", urlMatcher: "2" }
            ]
        });
    });

    it("400 on invalid request body", async () => {
        await request(server)
            .patch("/entrypoints/1")
            .send({ defaultConfiguration: { key: {} } })
            .set("Authorization", `Bearer ${token}`)
            .expect(400);
    });

    it("404 on entrypoint not found", () => {
        return request(server)
            .patch("/entrypoints/3")
            .send({})
            .set("Authorization", `Bearer ${token}`)
            .expect(404);
    });

    it("404 on linked app not found", () => {
        return request(server)
            .patch("/entrypoints/1")
            .send({ appId: "2" })
            .set("Authorization", `Bearer ${token}`)
            .expect(404);
    });

    it("404 on linked deployment not found", () => {
        return request(server)
            .patch("/entrypoints/1")
            .send({ activeDeploymentId: "1" })
            .set("Authorization", `Bearer ${token}`)
            .expect(404);
    });

    it("409 on existing entrypoint != selected entrypoint with urlMatcher == newUrlMatcher", () => {
        return request(server)
            .patch("/entrypoints/1")
            .send({ urlMatcher: "2" })
            .set("Authorization", `Bearer ${token}`)
            .expect(409);
    });

    it("no 409 on no existing entrypoint != selected entrypoint with urlMatcher = newUrlMatcher", () => {
        return request(server)
            .patch("/entrypoints/1")
            .send({ urlMatcher: "1" })
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
    });

    it("200 on entrypoint updated, updates entrypoint and returns it", async () => {
        const response = await request(server)
            .patch("/entrypoints/1")
            .send({ urlMatcher: "3" })
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(response.body).to.have.property("id", "1");
        expect(response.body).to.have.property("urlMatcher", "3");
    });
});
