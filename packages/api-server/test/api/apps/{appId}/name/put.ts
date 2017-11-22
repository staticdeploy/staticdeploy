import { expect } from "chai";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import request = require("supertest");

import { JWT_SECRET } from "config";
import getApp from "getApp";
import App from "models/App";

describe("api PUT /apps/:appId/name", () => {
    let server: Express;
    const token = sign({ sub: "sub" }, JWT_SECRET);

    before(async () => {
        server = await getApp();
        await App.destroy({ where: {} });
        await App.create({ id: "app", name: "app" });
        await App.create({ id: "other-app", name: "other-app" });
    });

    it("400 on name validation failed", () => {
        return request(server)
            .put("/apps/app/name")
            .set("Content-Type", "application/json")
            .send('"new_name"')
            .set("Authorization", `Bearer ${token}`)
            .expect(400);
    });

    it("404 on app not found", () => {
        return request(server)
            .put("/apps/non-existing/name")
            .set("Content-Type", "application/json")
            .send('"new-name"')
            .set("Authorization", `Bearer ${token}`)
            .expect(404);
    });

    it("409 on existing app != selected app with name == newName", () => {
        return request(server)
            .put("/apps/app/name")
            .set("Content-Type", "application/json")
            .send('"other-app"')
            .set("Authorization", `Bearer ${token}`)
            .expect(409);
    });

    it("no 409 on no existing app != selected app with name = newName", () => {
        return request(server)
            .put("/apps/app/name")
            .set("Content-Type", "application/json")
            .send('"app"')
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
    });

    it("200 on name updated, updates name and returns app", async () => {
        const response = await request(server)
            .put("/apps/app/name")
            .set("Content-Type", "application/json")
            .send('"new-name"')
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(response.body).to.have.property("id", "app");
        expect(response.body).to.have.property("name", "new-name");
    });
});
