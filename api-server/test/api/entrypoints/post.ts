import { expect } from "chai";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import request = require("supertest");

import { JWT_SECRET } from "config";
import getApp from "getApp";
import storage from "services/storage";
import { IIds, insertFixtures } from "../../setup";

describe("api POST /entrypoints", () => {
    let server: Express;
    const token = sign({ sub: "sub" }, JWT_SECRET);
    let ids: IIds;

    beforeEach(async () => {
        server = await getApp();
        ids = await insertFixtures({
            apps: [{ name: "0" }],
            entrypoints: [{ appId: "$0", urlMatcher: "0.com/" }]
        });
    });

    it("400 on invalid request body", () => {
        return request(server)
            .post("/entrypoints")
            .set("Authorization", `Bearer ${token}`)
            .send({})
            .expect(400);
    });

    it("400 on invalid urlMatcher", () => {
        return request(server)
            .post("/entrypoints")
            .set("Authorization", `Bearer ${token}`)
            .send({ appId: ids.apps[0], urlMatcher: "1" })
            .expect(400)
            .expect({ message: "1 is not a valid urlMatcher" });
    });

    it("404 on non-existing linked app", () => {
        return request(server)
            .post("/entrypoints")
            .set("Authorization", `Bearer ${token}`)
            .send({ appId: "non-existing", urlMatcher: "1.com/" })
            .expect(404);
    });

    it("409 on existing entrypoint with the same urlMatcher", () => {
        return request(server)
            .post("/entrypoints")
            .set("Authorization", `Bearer ${token}`)
            .send({ appId: ids.apps[0], urlMatcher: "0.com/" })
            .expect(409);
    });

    it("201 on entrypoint created, creates and returns the entrypoint", async () => {
        const response = await request(server)
            .post("/entrypoints")
            .set("Authorization", `Bearer ${token}`)
            .send({ appId: ids.apps[0], urlMatcher: "1.com/" })
            .expect(201);
        const entrypoint = await storage.entrypoints.findOneByIdOrUrlMatcher(
            "1.com/"
        );
        expect(response.body).to.be.jsonOf(entrypoint);
    });
});
