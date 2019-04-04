import { expect } from "chai";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import request from "supertest";

import { JWT_SECRET } from "config";
import getApp from "getApp";
import storage from "services/storage";
import { insertFixtures } from "../../../setup";

describe("api GET /apps/:appId", () => {
    let server: Express;
    const token = sign({ sub: "sub" }, JWT_SECRET);

    beforeEach(async () => {
        server = await getApp();
        await insertFixtures({
            apps: [{ name: "0" }]
        });
    });

    it("404 on app not found", () => {
        return request(server)
            .get("/apps/non-existing")
            .set("Authorization", `Bearer ${token}`)
            .expect(404)
            .expect({ message: "No app found with id = non-existing" });
    });

    it("200 and returns the app", async () => {
        const app = await storage.apps.findOneByIdOrName("0");
        const response = await request(server)
            .get(`/apps/${app!.id}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(response.body).to.be.jsonOf(app);
    });
});
