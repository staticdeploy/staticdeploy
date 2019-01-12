import { Operation } from "@staticdeploy/common-types";
import { expect } from "chai";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import request from "supertest";

import { JWT_SECRET } from "config";
import getApp from "getApp";
import storage from "services/storage";
import { IIds, insertFixtures } from "../../../setup";

describe("api DELETE /bundles/:bundleId", () => {
    let server: Express;
    const token = sign({ sub: "sub" }, JWT_SECRET);
    let ids: IIds;

    beforeEach(async () => {
        server = await getApp();
        ids = await insertFixtures({
            bundles: [{ name: "0", tag: "0" }, { name: "1", tag: "1" }],
            apps: [{ name: "0" }],
            entrypoints: [{ appId: 0, bundleId: 0, urlMatcher: "0.com/" }]
        });
    });

    it("404 on bundle not found", () => {
        return request(server)
            .delete("/bundles/non-existing")
            .set("Authorization", `Bearer ${token}`)
            .expect(404)
            .expect({ message: "No bundle found with id = non-existing" });
    });

    it("409 on bundle in use by entrypoint", () => {
        const bundleId = ids.bundles[0];
        const entrypointId = ids.entrypoints[0];
        return request(server)
            .delete(`/bundles/${bundleId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(409)
            .expect({
                message: `Can't delete bundle with id = ${bundleId} as it's being used by entrypoints with ids = ${entrypointId}`
            });
    });

    it("204 on bundle deleted, deletes the bundle", async () => {
        const bundleId = ids.bundles[1];
        await request(server)
            .delete(`/bundles/${bundleId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(204);
        const bundle = await storage.bundles.findOneById(bundleId);
        expect(bundle).to.equal(null);
    });

    it("on bundle deleted, saves an operation log for the deletion", async () => {
        const bundleId = ids.bundles[1];
        await request(server)
            .delete(`/bundles/${bundleId}`)
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
