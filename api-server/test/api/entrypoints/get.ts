import { expect } from "chai";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import request = require("supertest");

import { JWT_SECRET } from "config";
import getApp from "getApp";
import App from "models/App";
import Entrypoint from "models/Entrypoint";

describe("api GET /entrypoints", () => {
    let server: Express;
    const token = sign({ sub: "sub" }, JWT_SECRET);

    before(async () => {
        server = await getApp();
        await Entrypoint.destroy({ where: {} });
        await App.destroy({ where: {} });
        await App.create({ id: "1", name: "1" });
        await App.create({ id: "2", name: "2" });
        await Entrypoint.create({ id: "1", appId: "1", urlMatcher: "1" });
        await Entrypoint.create({ id: "2", appId: "2", urlMatcher: "2" });
    });

    it("404 on non-existing filter app", () => {
        return request(server)
            .get("/entrypoints?appIdOrName=3")
            .set("Authorization", `Bearer ${token}`)
            .expect(404);
    });

    it("filters entrypoints by appIdOrName", async () => {
        const response = await request(server)
            .get("/entrypoints?appIdOrName=1")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(response.body).to.have.length(1);
        expect(
            response.body.map((entrypoint: Entrypoint) => entrypoint.id)
        ).to.deep.equal(["1"]);
    });

    it("200 and returns all apps", async () => {
        const response = await request(server)
            .get("/entrypoints")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(response.body).to.have.length(2);
        expect(
            response.body.map((entrypoint: Entrypoint) => entrypoint.id)
        ).to.deep.equal(["1", "2"]);
    });
});
