import { expect } from "chai";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import request from "supertest";

import { JWT_SECRET } from "config";
import getApp from "getApp";
import storage from "services/storage";
import { insertFixtures } from "../../setup";

describe("api GET /bundles", () => {
    let server: Express;
    const token = sign({ sub: "sub" }, JWT_SECRET);

    beforeEach(async () => {
        server = await getApp();
        await insertFixtures({
            bundles: [{ name: "0", tag: "0" }, { name: "1", tag: "1" }]
        });
    });

    it("200 and returns all bundles", async () => {
        const bundles = await storage.bundles.findAll();
        const response = await request(server)
            .get("/bundles")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(response.body).to.be.jsonOf(bundles);
    });
});
