import { expect } from "chai";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import request from "supertest";

import { JWT_SECRET } from "config";
import getApp from "getApp";
import { insertFixtures } from "../../../../setup";

describe("api GET /bundleNames/:bundleName/bundleTags", () => {
    let server: Express;
    const token = sign({ sub: "sub" }, JWT_SECRET);

    beforeEach(async () => {
        server = await getApp();
        await insertFixtures({
            bundles: [
                { name: "0", tag: "0" },
                { name: "0", tag: "1" },
                { name: "1", tag: "2" },
                { name: "1", tag: "3" }
            ]
        });
    });

    it("200 and returns all tags of the bundles with the specified name", async () => {
        const response = await request(server)
            .get("/bundleNames/1/bundleTags")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(response.body).to.deep.equal(["2", "3"]);
    });
});
