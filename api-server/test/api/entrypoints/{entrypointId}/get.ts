import { expect } from "chai";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import request from "supertest";

import { JWT_SECRET } from "config";
import getApp from "getApp";
import storage from "services/storage";
import { IIds, insertFixtures } from "../../../setup";

describe("api GET /entrypoints/:entrypointId", () => {
    let server: Express;
    const token = sign({ sub: "sub" }, JWT_SECRET);
    let ids: IIds;

    beforeEach(async () => {
        server = await getApp();
        ids = await insertFixtures({
            apps: [{ name: "0" }],
            entrypoints: [{ appId: 0, urlMatcher: "0.com/" }]
        });
    });

    it("404 on entrypoint not found", () => {
        return request(server)
            .get("/entrypoints/non-existing")
            .set("Authorization", `Bearer ${token}`)
            .expect(404)
            .expect({ message: "No entrypoint found with id = non-existing" });
    });

    it("200 and returns the entrypoint", async () => {
        const entrypointId = ids.entrypoints[0];
        const entrypoint = await storage.entrypoints.findOneById(entrypointId);
        const response = await request(server)
            .get(`/entrypoints/${entrypointId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(response.body).to.be.jsonOf(entrypoint);
    });
});
