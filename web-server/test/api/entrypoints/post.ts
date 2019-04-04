import { Operation } from "@staticdeploy/common-types";
import { expect } from "chai";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import request from "supertest";

import { JWT_SECRET } from "config";
import getApp from "getApp";
import storage from "services/storage";
import { IIds, insertFixtures } from "../../setup";

describe("api POST /entrypoints", () => {
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

    it("400 on invalid request body", () => {
        return request(server)
            .post("/entrypoints")
            .set("Authorization", `Bearer ${token}`)
            .send({})
            .expect(400)
            .expect(/Validation failed/);
    });

    it("400 on invalid urlMatcher", () => {
        return request(server)
            .post("/entrypoints")
            .set("Authorization", `Bearer ${token}`)
            .send({ appId: ids.apps[0], urlMatcher: "1" })
            .expect(400)
            .expect({
                message: "1 is not a valid urlMatcher for an entrypoint"
            });
    });

    it("404 on non-existing linked app", () => {
        return request(server)
            .post("/entrypoints")
            .set("Authorization", `Bearer ${token}`)
            .send({ appId: "non-existing", urlMatcher: "1.com/" })
            .expect(404)
            .expect({ message: "No app found with id = non-existing" });
    });

    it("404 on non-existing linked bundle", () => {
        return request(server)
            .post("/entrypoints")
            .set("Authorization", `Bearer ${token}`)
            .send({
                appId: ids.apps[0],
                bundleId: "non-existing",
                urlMatcher: "1.com/"
            })
            .expect(404)
            .expect({ message: "No bundle found with id = non-existing" });
    });

    it("409 on existing entrypoint with the same urlMatcher", () => {
        return request(server)
            .post("/entrypoints")
            .set("Authorization", `Bearer ${token}`)
            .send({ appId: ids.apps[0], urlMatcher: "0.com/" })
            .expect(409)
            .expect({
                message: "An entrypoint with urlMatcher = 0.com/ already exists"
            });
    });

    it("201 on entrypoint created, creates and returns the entrypoint", async () => {
        const response = await request(server)
            .post("/entrypoints")
            .set("Authorization", `Bearer ${token}`)
            .send({ appId: ids.apps[0], urlMatcher: "1.com/" })
            .expect(201);
        const entrypoint = await storage.entrypoints.findOneByIdOrUrlMatcher(
            "1.com/"
        );
        expect(response.body).to.be.jsonOf(entrypoint);
    });

    it("on entrypoint created, saves an operation log for the creation", async () => {
        await request(server)
            .post("/entrypoints")
            .set("Authorization", `Bearer ${token}`)
            .send({ appId: ids.apps[0], urlMatcher: "1.com/" })
            .expect(201);
        const operationLogs = await storage.operationLogs.findAll();
        expect(operationLogs).to.have.length(1);
        expect(operationLogs[0]).to.have.property(
            "operation",
            Operation.createEntrypoint
        );
    });
});
