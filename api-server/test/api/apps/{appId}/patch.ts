import { Operation } from "@staticdeploy/common-types";
import { expect } from "chai";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import request from "supertest";

import { JWT_SECRET } from "config";
import getApp from "getApp";
import storage from "services/storage";
import { IIds, insertFixtures } from "../../../setup";

describe("api PATCH /apps/:appId", () => {
    let server: Express;
    const token = sign({ sub: "sub" }, JWT_SECRET);
    let ids: IIds;

    beforeEach(async () => {
        server = await getApp();
        ids = await insertFixtures({
            apps: [{ name: "0" }, { name: "1" }]
        });
    });

    it("400 on invalid request body", async () => {
        const appId = ids.apps[0];
        await request(server)
            .patch(`/apps/${appId}`)
            .send({ name: "*" })
            .set("Authorization", `Bearer ${token}`)
            .expect(400)
            .expect({ message: "* is not a valid name for an app" });
        await request(server)
            .patch(`/apps/${appId}`)
            .send({ defaultConfiguration: { key: {} } })
            .set("Authorization", `Bearer ${token}`)
            .expect(400)
            .expect({
                message:
                    "defaultConfiguration is not a valid configuration object"
            });
    });

    it("404 on app not found", () => {
        return request(server)
            .patch("/apps/non-existing")
            .send({})
            .set("Authorization", `Bearer ${token}`)
            .expect(404)
            .expect({ message: "No app found with id = non-existing" });
    });

    it("409 on existing app != selected app with name == newName", () => {
        const appId = ids.apps[0];
        return request(server)
            .patch(`/apps/${appId}`)
            .send({ name: "1" })
            .set("Authorization", `Bearer ${token}`)
            .expect(409)
            .expect({ message: "An app with name = 1 already exists" });
    });

    it("no 409 on no existing app != selected app with name = newName", () => {
        const appId = ids.apps[0];
        return request(server)
            .patch(`/apps/${appId}`)
            .send({ name: "0" })
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
    });

    it("200 on app updated, updates app and returns it", async () => {
        const appId = ids.apps[0];
        const response = await request(server)
            .patch(`/apps/${appId}`)
            .send({ name: "2" })
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(response.body).to.have.property("id", appId);
        expect(response.body).to.have.property("name", "2");
    });

    it("on app updated, saves an operation log for the update", async () => {
        const appId = ids.apps[0];
        await request(server)
            .patch(`/apps/${appId}`)
            .send({ name: "2" })
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        const operationLogs = await storage.operationLogs.findAll();
        expect(operationLogs).to.have.length(1);
        expect(operationLogs[0]).to.have.property(
            "operation",
            Operation.updateApp
        );
    });
});
