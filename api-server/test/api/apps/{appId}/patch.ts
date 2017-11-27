import { expect } from "chai";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import request = require("supertest");

import { JWT_SECRET } from "config";
import getApp from "getApp";
import insertFixtures from "../../../insertFixtures";

describe("api PATCH /apps/:appId", () => {
    let server: Express;
    const token = sign({ sub: "sub" }, JWT_SECRET);

    beforeEach(async () => {
        server = await getApp();
        await insertFixtures({
            apps: [{ id: "1", name: "1" }, { id: "2", name: "2" }]
        });
    });

    it("400 on invalid request body", async () => {
        await request(server)
            .patch("/apps/1")
            .send({ name: "3_" })
            .set("Authorization", `Bearer ${token}`)
            .expect(400);
        await request(server)
            .patch("/apps/1")
            .send({ defaultConfiguration: { key: {} } })
            .set("Authorization", `Bearer ${token}`)
            .expect(400);
    });

    it("404 on app not found", () => {
        return request(server)
            .patch("/apps/3")
            .send({})
            .set("Authorization", `Bearer ${token}`)
            .expect(404);
    });

    it("409 on existing app != selected app with name == newName", () => {
        return request(server)
            .patch("/apps/1")
            .send({ name: "2" })
            .set("Authorization", `Bearer ${token}`)
            .expect(409);
    });

    it("no 409 on no existing app != selected app with name = newName", () => {
        return request(server)
            .patch("/apps/1")
            .send({ name: "1" })
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
    });

    it("200 on app updated, updates app and returns it", async () => {
        const response = await request(server)
            .patch("/apps/1")
            .send({ name: "3" })
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(response.body).to.have.property("id", "1");
        expect(response.body).to.have.property("name", "3");
    });
});
