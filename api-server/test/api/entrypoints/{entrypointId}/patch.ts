import { expect } from "chai";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import request from "supertest";

import { JWT_SECRET } from "config";
import getApp from "getApp";
import { Operation } from "services/operations";
import storage from "services/storage";
import { IIds, insertFixtures } from "../../../setup";

describe("api PATCH /entrypoints/:entrypointId", () => {
    let server: Express;
    const token = sign({ sub: "sub" }, JWT_SECRET);
    let ids: IIds;

    beforeEach(async () => {
        server = await getApp();
        ids = await insertFixtures({
            apps: [{ name: "0" }],
            entrypoints: [
                { appId: 0, urlMatcher: "0.com/" },
                { appId: 0, urlMatcher: "1.com/" }
            ]
        });
    });

    it("400 on invalid request body", async () => {
        const entrypointId = ids.entrypoints[0];
        await request(server)
            .patch(`/entrypoints/${entrypointId}`)
            .send({ "non-accepted-prop": "value" })
            .set("Authorization", `Bearer ${token}`)
            .expect(400)
            .expect(/Validation failed/);
    });

    it("400 on invalid urlMatcher", async () => {
        const entrypointId = ids.entrypoints[0];
        await request(server)
            .patch(`/entrypoints/${entrypointId}`)
            .send({ urlMatcher: "2" })
            .set("Authorization", `Bearer ${token}`)
            .expect(400)
            .expect({
                message: "2 is not a valid urlMatcher for an entrypoint"
            });
    });

    it("404 on entrypoint not found", () => {
        return request(server)
            .patch("/entrypoints/non-existing")
            .send({})
            .set("Authorization", `Bearer ${token}`)
            .expect(404)
            .expect({ message: "No entrypoint found with id = non-existing" });
    });

    it("404 on linked app not found", () => {
        const entrypointId = ids.entrypoints[0];
        return request(server)
            .patch(`/entrypoints/${entrypointId}`)
            .send({ appId: "non-existing" })
            .set("Authorization", `Bearer ${token}`)
            .expect(404)
            .expect({ message: "No app found with id = non-existing" });
    });

    it("404 on linked bundle not found", () => {
        const entrypointId = ids.entrypoints[0];
        return request(server)
            .patch(`/entrypoints/${entrypointId}`)
            .send({ bundleId: "non-existing" })
            .set("Authorization", `Bearer ${token}`)
            .expect(404)
            .expect({ message: "No bundle found with id = non-existing" });
    });

    it("409 on existing entrypoint != selected entrypoint with urlMatcher == newUrlMatcher", () => {
        const entrypointId = ids.entrypoints[0];
        return request(server)
            .patch(`/entrypoints/${entrypointId}`)
            .send({ urlMatcher: "1.com/" })
            .set("Authorization", `Bearer ${token}`)
            .expect(409)
            .expect({
                message: "An entrypoint with urlMatcher = 1.com/ already exists"
            });
    });

    it("no 409 on no existing entrypoint != selected entrypoint with urlMatcher = newUrlMatcher", () => {
        const entrypointId = ids.entrypoints[0];
        return request(server)
            .patch(`/entrypoints/${entrypointId}`)
            .send({ urlMatcher: "0.com/" })
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
    });

    it("200 on entrypoint updated, updates entrypoint and returns it", async () => {
        const entrypointId = ids.entrypoints[0];
        const response = await request(server)
            .patch(`/entrypoints/${entrypointId}`)
            .send({ urlMatcher: "2.com/" })
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        const entrypoint = await storage.entrypoints.findOneById(entrypointId);
        expect(response.body).to.be.jsonOf(entrypoint);
    });

    it("on entrypoint updated, saves an operation log for the update", async () => {
        const entrypointId = ids.entrypoints[0];
        await request(server)
            .patch(`/entrypoints/${entrypointId}`)
            .send({ urlMatcher: "2.com/" })
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        const operationLogs = await storage.operationLogs.findAll();
        expect(operationLogs).to.have.length(1);
        expect(operationLogs[0]).to.have.property(
            "operation",
            Operation.updateEntrypoint
        );
    });
});
