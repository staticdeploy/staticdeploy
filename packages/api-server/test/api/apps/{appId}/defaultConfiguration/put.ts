import { expect } from "chai";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import request = require("supertest");

import { JWT_SECRET } from "config";
import getApp from "getApp";
import App from "models/App";

describe("api PUT /apps/:appId/defaultConfiguration", () => {
    let server: Express;
    const token = sign({ sub: "sub" }, JWT_SECRET);

    before(async () => {
        server = await getApp();
        await App.destroy({ where: {} });
        await App.create({ id: "app", name: "app" });
    });

    it("400 on defaultConfiguration validation failed", () => {
        return request(server)
            .put("/apps/app/defaultConfiguration")
            .send({ key: {} })
            .set("Authorization", `Bearer ${token}`)
            .expect(400);
    });

    it("404 on app not found", () => {
        return request(server)
            .put("/apps/non-existing/defaultConfiguration")
            .send({})
            .set("Authorization", `Bearer ${token}`)
            .expect(404);
    });

    it("200 on defaultConfiguration updated, updates defaultConfiguration and returns app", async () => {
        const response = await request(server)
            .put("/apps/app/defaultConfiguration")
            .send({ key: "val" })
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(response.body).to.have.property("id", "app");
        expect(response.body).to.have.deep.property("defaultConfiguration", {
            key: "val"
        });
    });
});
