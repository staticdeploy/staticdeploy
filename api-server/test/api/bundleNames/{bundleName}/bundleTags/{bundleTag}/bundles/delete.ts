import { Operation } from "@staticdeploy/common-types";
import { expect } from "chai";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import request from "supertest";

import { JWT_SECRET } from "config";
import getApp from "getApp";
import storage from "services/storage";
import { IIds, insertFixtures } from "../../../../../../setup";

describe("api DELETE /bundleNames/:bundleName/bundleTags/:bundleTag/bundles", () => {
    let server: Express;
    const token = sign({ sub: "sub" }, JWT_SECRET);
    let ids: IIds;

    beforeEach(async () => {
        server = await getApp();
        ids = await insertFixtures({
            bundles: [
                { name: "0", tag: "0" },
                { name: "0", tag: "0" },
                { name: "1", tag: "1" },
                { name: "1", tag: "1" }
            ],
            apps: [{ name: "0" }],
            entrypoints: [{ appId: 0, bundleId: 0, urlMatcher: "0.com/" }]
        });
    });

    it("409 on some bundle in use by some entrypoint", () => {
        const bundleIds = [ids.bundles[0], ids.bundles[1]];
        const bundleIdsString = bundleIds.join(", ");
        const entrypointId = ids.entrypoints[0];
        return request(server)
            .delete("/bundleNames/0/bundleTags/0/bundles")
            .set("Authorization", `Bearer ${token}`)
            .expect(409)
            .expect({
                message: `Can't delete bundles with id = ${bundleIdsString}, as ore or more of them are being used by entrypoints with ids = ${entrypointId}`
            });
    });

    it("204 on bundles deleted, deletes the bundle", async () => {
        await request(server)
            .delete("/bundleNames/1/bundleTags/1/bundles")
            .set("Authorization", `Bearer ${token}`)
            .expect(204);
        const bundles = await storage.bundles.findByNameTagCombination("1:1");
        expect(bundles).to.have.length(0);
    });

    it("on bundles deleted, saves an operation log for the deletion", async () => {
        await request(server)
            .delete("/bundleNames/1/bundleTags/1/bundles")
            .set("Authorization", `Bearer ${token}`)
            .expect(204);
        const operationLogs = await storage.operationLogs.findAll();
        expect(operationLogs).to.have.length(1);
        expect(operationLogs[0]).to.have.property(
            "operation",
            Operation.deleteBundle
        );
    });
});
