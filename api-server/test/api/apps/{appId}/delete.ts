import { expect } from "chai";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import request from "supertest";

import { JWT_SECRET } from "config";
import getApp from "getApp";
import storage from "services/storage";
import { IIds, insertFixtures } from "../../../setup";

describe("api DELETE /apps/:appId", () => {
    let server: Express;
    const token = sign({ sub: "sub" }, JWT_SECRET);
    let ids: IIds;

    beforeEach(async () => {
        server = await getApp();
        ids = await insertFixtures({
            apps: [{ name: "0" }]
        });
    });

    it("404 on app not found", () => {
        return request(server)
            .delete("/apps/non-existing")
            .set("Authorization", `Bearer ${token}`)
            .expect(404)
            .expect({ message: "No app found with id = non-existing" });
    });

    it("204 on app deleted, deletes the app", async () => {
        const appId = ids.apps[0];
        await request(server)
            .delete(`/apps/${appId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(204);
        expect(await storage.apps.findOneById(appId)).to.equal(null);
    });
});
