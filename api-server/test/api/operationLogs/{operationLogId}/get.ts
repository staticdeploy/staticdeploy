import { expect } from "chai";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import request from "supertest";

import { JWT_SECRET } from "config";
import getApp from "getApp";
import storage from "services/storage";
import { IIds, insertFixtures } from "../../../setup";

describe("api GET /operationLogs/:operationLogId", () => {
    let server: Express;
    const token = sign({ sub: "sub" }, JWT_SECRET);
    let ids: IIds;

    beforeEach(async () => {
        server = await getApp();
        ids = await insertFixtures({ operationLogs: [{}] });
    });

    it("404 on operation log not found", () => {
        return request(server)
            .get("/operationLogs/non-existing")
            .set("Authorization", `Bearer ${token}`)
            .expect(404)
            .expect({
                message: "No operation log found with id = non-existing"
            });
    });

    it("200 and returns the operation log", async () => {
        const operationLogId = ids.operationLogs[0];
        const response = await request(server)
            .get(`/operationLogs/${operationLogId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        const operationLog = await storage.operationLogs.findOneById(
            operationLogId
        );
        expect(response.body).to.be.jsonOf(operationLog);
    });
});
