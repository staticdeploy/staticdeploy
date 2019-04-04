import { expect } from "chai";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import request from "supertest";

import { JWT_SECRET } from "config";
import getApp from "getApp";
import storage from "services/storage";
import { insertFixtures } from "../../../setup";

describe("api GET /bundles/:bundleId", () => {
    let server: Express;
    const token = sign({ sub: "sub" }, JWT_SECRET);

    beforeEach(async () => {
        server = await getApp();
        await insertFixtures({
            bundles: [{ name: "0", tag: "0" }]
        });
    });

    it("404 on bundle not found", () => {
        return request(server)
            .get("/bundles/non-existing")
            .set("Authorization", `Bearer ${token}`)
            .expect(404)
            .expect({ message: "No bundle found with id = non-existing" });
    });

    it("200 and returns the bundle", async () => {
        const bundle = await storage.bundles.findLatestByNameTagCombination(
            "0:0"
        );
        const response = await request(server)
            .get(`/bundles/${bundle!.id}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(response.body).to.be.jsonOf(bundle);
    });
});
