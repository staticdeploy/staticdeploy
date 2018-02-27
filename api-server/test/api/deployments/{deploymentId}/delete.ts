import { expect } from "chai";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import request from "supertest";

import { JWT_SECRET } from "config";
import getApp from "getApp";
import storage from "services/storage";
import { IIds, insertFixtures } from "../../../setup";

describe("api DELETE /deployments/:deploymentId", () => {
    let server: Express;
    const token = sign({ sub: "sub" }, JWT_SECRET);
    let ids: IIds;

    beforeEach(async () => {
        server = await getApp();
        ids = await insertFixtures({
            apps: [{ name: "0" }],
            entrypoints: [{ appId: "$0", urlMatcher: "0.com/" }],
            deployments: [{ entrypointId: "$0" }]
        });
    });

    it("404 on deployment not found", () => {
        return request(server)
            .delete("/deployments/non-existing")
            .set("Authorization", `Bearer ${token}`)
            .expect(404);
    });

    it("204 on deployment deleted, deletes the deployment", async () => {
        const deploymentId = ids.deployments[0];
        await request(server)
            .delete(`/deployments/${deploymentId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(204);
        const deployment = await storage.deployments.findOneById(deploymentId);
        expect(deployment).to.equal(null);
    });
});
