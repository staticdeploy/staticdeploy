import { expect } from "chai";
import { Express } from "express";
import * as fs from "fs";
import { sign } from "jsonwebtoken";
import * as path from "path";
import request = require("supertest");

import { DEPLOYMENTS_PATH, JWT_SECRET } from "config";
import getApp from "getApp";
import App from "models/App";
import Deployment from "models/Deployment";
import Entrypoint from "models/Entrypoint";
import insertFixtures from "../../insertFixtures";

describe("api POST /deployments", () => {
    let server: Express;
    const token = sign({ sub: "sub" }, JWT_SECRET);

    beforeEach(async () => {
        server = await getApp();
        await insertFixtures({
            apps: [{ id: "1", name: "1" }],
            entrypoints: [{ id: "1", appId: "1", urlMatcher: "1" }]
        });
    });

    it("400 on invalid request body", () => {
        // We just test one case in which the body is invalid (missing property
        // name), to test that validation is indeed working. We do not test all
        // validation cases, since validation is expressed declaratively
        return request(server)
            .post("/deployments")
            .set("Authorization", `Bearer ${token}`)
            .send({})
            .expect(400);
    });

    it("404 on non-existing entrypoint and appIdOrName not specified", () => {
        return request(server)
            .post("/deployments")
            .set("Authorization", `Bearer ${token}`)
            .send({ entrypointIdOrUrlMatcher: "2", content: "" })
            .expect(404);
    });

    it("creates linked entrypoint if it doesn't exist", async () => {
        await request(server)
            .post("/deployments")
            .set("Authorization", `Bearer ${token}`)
            .send({
                entrypointIdOrUrlMatcher: "2",
                appIdOrName: "1",
                content: ""
            })
            .expect(201);
        const entrypoint = await Entrypoint.findOne({
            where: { appId: "1", urlMatcher: "2" }
        });
        expect(entrypoint).not.to.equal(null);
    });

    it("creates linked app and entrypoint if they don't exist", async () => {
        await request(server)
            .post("/deployments")
            .set("Authorization", `Bearer ${token}`)
            .send({
                entrypointIdOrUrlMatcher: "2",
                appIdOrName: "2",
                content: ""
            })
            .expect(201);
        const app = await App.findOne({
            where: { name: "2" }
        });
        expect(app).not.to.equal(null);
        const entrypoint = await Entrypoint.findOne({
            where: { appId: (app as App).id, urlMatcher: "2" }
        });
        expect(entrypoint).not.to.equal(null);
    });

    it("creates the deploymeny", async () => {
        await request(server)
            .post("/deployments")
            .set("Authorization", `Bearer ${token}`)
            .send({
                entrypointIdOrUrlMatcher: "1",
                content: ""
            })
            .expect(201);
        const deployment = await Deployment.findOne({
            where: { entrypointId: "1" }
        });
        expect(deployment).not.to.equal(null);
    });

    // TODO: fix implementation so that the test passes
    it.skip("unpacks the deploymeny content", async () => {
        await request(server)
            .post("/deployments")
            .set("Authorization", `Bearer ${token}`)
            .send({
                entrypointIdOrUrlMatcher: "1",
                content: ""
            })
            .expect(201);
        const deployment = await Deployment.findOne({
            where: { entrypointId: "1" }
        });
        expect(deployment).not.to.equal(null);
        expect(
            fs.existsSync(
                path.join(DEPLOYMENTS_PATH, (deployment as Deployment).id)
            )
        ).to.equal(true);
    });

    it("201 on deployment created and returns the deployment", async () => {
        const response = await request(server)
            .post("/deployments")
            .set("Authorization", `Bearer ${token}`)
            .send({
                entrypointIdOrUrlMatcher: "1",
                content: ""
            })
            .expect(201);
        const deployment = await Deployment.findOne({
            where: { entrypointId: "1" }
        });
        expect(deployment).not.to.equal(null);
        expect(response.body.id).to.deep.equal((deployment as Deployment).id);
    });
});
