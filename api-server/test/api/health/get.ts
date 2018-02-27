import { Express } from "express";
import { sign } from "jsonwebtoken";
import { SinonStub, stub } from "sinon";
import request from "supertest";

import { JWT_SECRET } from "config";
import getApp from "getApp";
import storage from "services/storage";

const isStub = (thing: any): thing is SinonStub =>
    typeof thing.restore === "function";

describe("api GET /health", () => {
    let server: Express;
    const token = sign({ sub: "sub" }, JWT_SECRET);

    beforeEach(async () => {
        server = await getApp();
    });
    afterEach(() => {
        const { checkHealth } = storage;
        if (isStub(checkHealth)) {
            checkHealth.restore();
        }
    });

    it("503 on un-healthy", () => {
        stub(storage, "checkHealth").returns({ isHealthy: false });
        return request(server)
            .get("/health")
            .set("Authorization", `Bearer ${token}`)
            .expect(503);
    });

    it("200 on healthy", () => {
        return request(server)
            .get("/health")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
    });
});
