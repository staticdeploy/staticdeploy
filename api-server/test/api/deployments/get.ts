import { expect } from "chai";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import request from "supertest";

import { JWT_SECRET } from "config";
import getApp from "getApp";
import storage from "services/storage";
import { IIds, insertFixtures } from "../../setup";

describe("api GET /deployments", () => {
    let server: Express;
    const token = sign({ sub: "sub" }, JWT_SECRET);
    let ids: IIds;

    beforeEach(async () => {
        server = await getApp();
        ids = await insertFixtures({
            apps: [{ name: "0" }],
            entrypoints: [
                { appId: "$0", urlMatcher: "0.com/" },
                { appId: "$0", urlMatcher: "1.com/" }
            ],
            deployments: [{ entrypointId: "$0" }, { entrypointId: "$1" }]
        });
    });

    it("404 on non-existing filter entrypoint", () => {
        return request(server)
            .get("/deployments?entrypointIdOrUrlMatcher=non-existing")
            .set("Authorization", `Bearer ${token}`)
            .expect(404);
    });

    describe("filters deployments by entrypointIdOrUrlMatcher", () => {
        it("case: filter by id", async () => {
            const entrypointId = ids.entrypoints[0];
            const deploymentId = ids.deployments[0];
            const deployment = await storage.deployments.findOneById(
                deploymentId
            );
            const response = await request(server)
                .get(`/deployments?entrypointIdOrUrlMatcher=${entrypointId}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(200);
            expect(response.body).to.be.jsonOf([deployment]);
        });
        it("case: filter by urlMatcher", async () => {
            const deploymentId = ids.deployments[0];
            const deployment = await storage.deployments.findOneById(
                deploymentId
            );
            const response = await request(server)
                .get(`/deployments?entrypointIdOrUrlMatcher=0.com/`)
                .set("Authorization", `Bearer ${token}`)
                .expect(200);
            expect(response.body).to.be.jsonOf([deployment]);
        });
    });

    it("200 and returns all deployments", async () => {
        const deployments = await storage.deployments.findAll();
        const response = await request(server)
            .get("/deployments")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(response.body).to.be.jsonOf(deployments);
    });
});
