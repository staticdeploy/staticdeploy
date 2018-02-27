import { expect } from "chai";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import request from "supertest";

import { JWT_SECRET } from "config";
import getApp from "getApp";
import storage from "services/storage";
import { insertFixtures } from "../../setup";

describe("api POST /deployments", () => {
    let server: Express;
    const token = sign({ sub: "sub" }, JWT_SECRET);

    beforeEach(async () => {
        server = await getApp();
        await insertFixtures({
            apps: [{ name: "0" }],
            entrypoints: [{ appId: "$0", urlMatcher: "0.com/" }]
        });
    });

    it("400 on invalid request body", () => {
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
            .send({ entrypointIdOrUrlMatcher: "non-existing", content: "" })
            .expect(404);
    });

    it("creates linked entrypoint if it doesn't exist (but app exists)", async () => {
        await request(server)
            .post("/deployments")
            .set("Authorization", `Bearer ${token}`)
            .send({
                entrypointIdOrUrlMatcher: "1.com/",
                appIdOrName: "0",
                content: ""
            })
            .expect(201);
        const entrypoint = await storage.entrypoints.findOneByIdOrUrlMatcher(
            "1.com/"
        );
        expect(entrypoint).not.to.equal(null);
    });

    it("creates linked app and entrypoint if they don't exist", async () => {
        await request(server)
            .post("/deployments")
            .set("Authorization", `Bearer ${token}`)
            .send({
                entrypointIdOrUrlMatcher: "1.com/",
                appIdOrName: "1",
                content: ""
            })
            .expect(201);
        const app = await storage.apps.findOneByIdOrName("1");
        expect(app).not.to.equal(null);
        const entrypoint = await storage.entrypoints.findOneByIdOrUrlMatcher(
            "1.com/"
        );
        expect(entrypoint).not.to.equal(null);
    });

    it("creates the deploymeny", async () => {
        await request(server)
            .post("/deployments")
            .set("Authorization", `Bearer ${token}`)
            .send({
                entrypointIdOrUrlMatcher: "0.com/",
                content: ""
            })
            .expect(201);
        const deployments = await storage.deployments.findAll();
        expect(deployments).to.have.length(1);
    });

    it("201 on deployment created and returns the deployment", async () => {
        const response = await request(server)
            .post("/deployments")
            .set("Authorization", `Bearer ${token}`)
            .send({
                entrypointIdOrUrlMatcher: "0.com/",
                content: ""
            })
            .expect(201);
        const [deployment] = await storage.deployments.findAll();
        expect(response.body).to.be.jsonOf(deployment);
    });
});
