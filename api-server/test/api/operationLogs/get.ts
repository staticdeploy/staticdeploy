import { expect } from "chai";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import request from "supertest";

import { JWT_SECRET } from "config";
import getApp from "getApp";
import storage from "services/storage";
import { insertFixtures } from "../../setup";

describe("api GET /operationLogs", () => {
    let server: Express;
    const token = sign({ sub: "sub" }, JWT_SECRET);

    beforeEach(async () => {
        server = await getApp();
        await insertFixtures({ operationLogs: [{}, {}] });
    });

    it("200 and returns all operationLogs", async () => {
        const response = await request(server)
            .get("/operationLogs")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        const operationLogs = await storage.operationLogs.findAll();
        expect(response.body).to.be.jsonOf(operationLogs);
    });
});
