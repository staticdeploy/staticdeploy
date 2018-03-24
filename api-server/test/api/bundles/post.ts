import { expect } from "chai";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import request from "supertest";

import { JWT_SECRET } from "config";
import getApp from "getApp";
import storage from "services/storage";
import { insertFixtures } from "../../setup";

describe("api POST /bundles", () => {
    let server: Express;
    const token = sign({ sub: "sub" }, JWT_SECRET);

    beforeEach(async () => {
        server = await getApp();
        await insertFixtures({});
    });

    it("400 on invalid request body", () => {
        return request(server)
            .post("/bundles")
            .set("Authorization", `Bearer ${token}`)
            .send({})
            .expect(400)
            .expect(/Validation failed/);
    });

    it("400 on invalid name", () => {
        return request(server)
            .post("/bundles")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "*", tag: "0", description: "0", content: "" })
            .expect(400)
            .expect({ message: "* is not a valid name for a bundle" });
    });

    it("400 on invalid tag", () => {
        return request(server)
            .post("/bundles")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "0", tag: "*", description: "0", content: "" })
            .expect(400)
            .expect({ message: "* is not a valid tag for a bundle" });
    });

    it("creates the bundle", async () => {
        await request(server)
            .post("/bundles")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "0", tag: "0", description: "0", content: "" })
            .expect(201);
        const bundles = await storage.bundles.findAll();
        expect(bundles).to.have.length(1);
    });

    it("201 on bundle created and returns the bundle", async () => {
        const response = await request(server)
            .post("/bundles")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "0", tag: "0", description: "0", content: "" })
            .expect(201);
        const [bundle] = await storage.bundles.findAll();
        expect(response.body).to.be.jsonOf(bundle);
    });
});
