import { expect } from "chai";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import request = require("supertest");

import { JWT_SECRET } from "config";
import getApp from "getApp";
import Entrypoint from "models/Entrypoint";
import insertFixtures from "../../insertFixtures";

describe("api POST /entrypoints", () => {
    let server: Express;
    const token = sign({ sub: "sub" }, JWT_SECRET);

    before(async () => {
        server = await getApp();
        await insertFixtures({
            apps: [{ id: "1", name: "1" }],
            entrypoints: [{ id: "1", appId: "1", urlMatcher: "1" }]
        });
    });

    it("400 on invalid request body", () => {
        // We just test one case in which the body is invalid (missing property
        // name), to test that validation is indeed working. We do not test all
        // validation cases, since validation is expressed declaratively
        return request(server)
            .post("/entrypoints")
            .set("Authorization", `Bearer ${token}`)
            .send({})
            .expect(400);
    });

    it("404 on non-existing linked app", () => {
        return request(server)
            .post("/entrypoints")
            .set("Authorization", `Bearer ${token}`)
            .send({ appId: "2", urlMatcher: "2" })
            .expect(404);
    });

    it("409 on existing entrypoint with the same urlMatcher", () => {
        return request(server)
            .post("/entrypoints")
            .set("Authorization", `Bearer ${token}`)
            .send({ appId: "1", urlMatcher: "1" })
            .expect(409);
    });

    it("201 on entrypoint created, creates and returns the entrypoint", async () => {
        const response = await request(server)
            .post("/entrypoints")
            .set("Authorization", `Bearer ${token}`)
            .send({ appId: "1", urlMatcher: "2" })
            .expect(201);
        const entrypoint = await Entrypoint.findOne({
            where: { urlMatcher: "2" }
        });
        expect(entrypoint).not.to.equal(null);
        expect(response.body.id).to.deep.equal((entrypoint as Entrypoint).id);
    });
});
