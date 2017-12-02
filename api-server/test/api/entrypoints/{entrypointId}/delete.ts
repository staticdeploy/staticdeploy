import { expect } from "chai";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import request = require("supertest");

import { JWT_SECRET } from "config";
import getApp from "getApp";
import Deployment from "models/Deployment";
import Entrypoint from "models/Entrypoint";
import insertFixtures from "../../../insertFixtures";

describe("api DELETE /entrypoints/:entrypointId", () => {
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

    it("404 on entrypoint not found", () => {
        return request(server)
            .delete("/entrypoints/2")
            .set("Authorization", `Bearer ${token}`)
            .expect(404);
    });

    it("204 on entrypoint deleted, deletes the entrypoint", async () => {
        await request(server)
            .delete("/entrypoints/1")
            .set("Authorization", `Bearer ${token}`)
            .expect(204);
        const entrypoint = await Entrypoint.findById("1");
        expect(entrypoint).to.equal(null);
    });

    it("on entrypoint deleted, deletes linked deployments", async () => {
        await request(server)
            .delete("/entrypoints/1")
            .set("Authorization", `Bearer ${token}`)
            .expect(204);
        const entrypoint = await Entrypoint.findById("1");
        expect(entrypoint).to.equal(null);
        const deployment = await Deployment.findById("1");
        expect(deployment).to.equal(null);
    });
});
