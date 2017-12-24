import { expect } from "chai";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import request = require("supertest");

import { JWT_SECRET } from "config";
import getApp from "getApp";
import storage from "services/storage";
import { insertFixtures } from "../../setup";

describe("api POST /apps", () => {
    let server: Express;
    const token = sign({ sub: "sub" }, JWT_SECRET);

    beforeEach(async () => {
        server = await getApp();
        await insertFixtures({
            apps: [{ name: "0" }]
        });
    });

    it("400 on invalid request body", () => {
        // We just test one case in which the body is invalid (missing property
        // name), to test that validation is indeed working. We do not test all
        // validation cases, since validation is expressed declaratively
        return request(server)
            .post("/apps")
            .set("Authorization", `Bearer ${token}`)
            .send({})
            .expect(400);
    });

    it("409 on existing app with the same name", () => {
        return request(server)
            .post("/apps")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "0" })
            .expect(409);
    });

    it("201 on app created, creates and returns the app", async () => {
        const response = await request(server)
            .post("/apps")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "1" })
            .expect(201);
        const app = await storage.apps.findOneByIdOrName("1");
        expect(response.body).to.be.jsonOf(app);
    });
});
