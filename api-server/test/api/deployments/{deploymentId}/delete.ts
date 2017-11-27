import { expect } from "chai";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import request = require("supertest");

import { JWT_SECRET } from "config";
import getApp from "getApp";
import Deployment from "models/Deployment";
import insertFixtures from "../../../insertFixtures";

describe("api DELETE /deployments/:deploymentId", () => {
    let server: Express;
    const token = sign({ sub: "sub" }, JWT_SECRET);

    beforeEach(async () => {
        server = await getApp();
        await insertFixtures({
            apps: [{ id: "1", name: "1" }],
            entrypoints: [{ id: "1", appId: "1", urlMatcher: "1" }],
            deployments: [{ id: "1", entrypointId: "1" }]
        });
    });

    it("404 on deployment not found", () => {
        return request(server)
            .delete("/deployments/2")
            .set("Authorization", `Bearer ${token}`)
            .expect(404);
    });

    it("204 on deployment deleted, deletes the deployment", async () => {
        await request(server)
            .delete("/deployments/1")
            .set("Authorization", `Bearer ${token}`)
            .expect(204);
        const deployment = await Deployment.findById("1");
        expect(deployment).to.equal(null);
    });
});
