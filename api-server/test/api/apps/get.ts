import { expect } from "chai";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import request = require("supertest");

import { JWT_SECRET } from "config";
import getApp from "getApp";
import storage from "services/storage";
import { insertFixtures } from "../../setup";

describe("api GET /apps", () => {
    let server: Express;
    const token = sign({ sub: "sub" }, JWT_SECRET);

    beforeEach(async () => {
        server = await getApp();
        await insertFixtures({
            apps: [{ name: "0" }, { name: "1" }]
        });
    });

    it("200 and returns all apps", async () => {
        const response = await request(server)
            .get("/apps")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        const apps = await storage.apps.findAll();
        expect(response.body).to.be.jsonOf(apps);
    });
});
