import { expect } from "chai";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import request = require("supertest");

import { JWT_SECRET } from "config";
import getApp from "getApp";
import App from "models/App";
import Deployment from "models/Deployment";
import Entrypoint from "models/Entrypoint";

describe.only("api GET /deployments", () => {
    let server: Express;
    const token = sign({ sub: "sub" }, JWT_SECRET);

    before(async () => {
        server = await getApp();
        await Deployment.destroy({ where: {} });
        await Entrypoint.destroy({ where: {} });
        await App.destroy({ where: {} });
        await App.create({ id: "1", name: "1" });
        await Entrypoint.create({ id: "1", appId: "1", urlMatcher: "1" });
        await Entrypoint.create({ id: "2", appId: "1", urlMatcher: "2" });
        await Deployment.create({ id: "1", entrypointId: "1" });
        await Deployment.create({ id: "2", entrypointId: "2" });
    });

    it("404 on non-existing filter entrypoint", () => {
        return request(server)
            .get("/deployments?entrypointIdOrUrlMatcher=3")
            .set("Authorization", `Bearer ${token}`)
            .expect(404);
    });

    it("filters deployments by entrypointIdOrUrlMatcher", async () => {
        const response = await request(server)
            .get("/deployments?entrypointIdOrUrlMatcher=1")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(response.body).to.have.length(1);
        expect(
            response.body.map((deployment: Deployment) => deployment.id)
        ).to.deep.equal(["1"]);
    });

    it("200 and returns all deployments", async () => {
        const response = await request(server)
            .get("/deployments")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(response.body).to.have.length(2);
        expect(
            response.body.map((deployment: Deployment) => deployment.id)
        ).to.deep.equal(["1", "2"]);
    });
});
