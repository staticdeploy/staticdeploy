import { expect } from "chai";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import request = require("supertest");

import { JWT_SECRET } from "config";
import getApp from "getApp";
import App from "models/App";
import Deployment from "models/Deployment";
import Entrypoint from "models/Entrypoint";
import insertFixtures from "../../../insertFixtures";

describe("api DELETE /apps/:appId", () => {
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

    it("404 on app not found", () => {
        return request(server)
            .delete("/apps/2")
            .set("Authorization", `Bearer ${token}`)
            .expect(404);
    });

    it("204 on app deleted, deletes the app", async () => {
        await request(server)
            .delete("/apps/1")
            .set("Authorization", `Bearer ${token}`)
            .expect(204);
        const app = await App.findById("1");
        expect(app).to.equal(null);
    });

    it("on app deleted, deletes linked entrypoints and deployments", async () => {
        await request(server)
            .delete("/apps/1")
            .set("Authorization", `Bearer ${token}`)
            .expect(204);
        const app = await App.findById("1");
        expect(app).to.equal(null);
        const entrypoint = await Entrypoint.findById("1");
        expect(entrypoint).to.equal(null);
        const deployment = await Deployment.findById("1");
        expect(deployment).to.equal(null);
    });
});
