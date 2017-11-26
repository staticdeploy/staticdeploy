import { expect } from "chai";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import request = require("supertest");

import { JWT_SECRET } from "config";
import getApp from "getApp";
import App from "models/App";

describe("api PATCH /apps/:appId", () => {
    let server: Express;
    const token = sign({ sub: "sub" }, JWT_SECRET);

    before(async () => {
        server = await getApp();
        await App.destroy({ where: {} });
        await App.create({ id: "app", name: "app" });
        await App.create({ id: "other-app", name: "other-app" });
    });

    it("400 on validation failed", async () => {
        await request(server)
            .patch("/apps/app")
            .send({ name: "new_name" })
            .set("Authorization", `Bearer ${token}`)
            .expect(400);
        await request(server)
            .patch("/apps/app")
            .send({ defaultConfiguration: { key: {} } })
            .set("Authorization", `Bearer ${token}`)
            .expect(400);
    });

    it("404 on app not found", () => {
        return request(server)
            .patch("/apps/non-existing")
            .send({})
            .set("Authorization", `Bearer ${token}`)
            .expect(404);
    });

    it("409 on existing app != selected app with name == newName", () => {
        return request(server)
            .patch("/apps/app")
            .send({ name: "other-app" })
            .set("Authorization", `Bearer ${token}`)
            .expect(409);
    });

    it("no 409 on no existing app != selected app with name = newName", () => {
        return request(server)
            .patch("/apps/app")
            .send({ name: "app" })
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
    });

    it("200 on app updated, updates app and returns it", async () => {
        const response = await request(server)
            .patch("/apps/app")
            .send({ name: "new-name", defaultConfiguration: { key: "value" } })
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(response.body).to.have.property("id", "app");
        expect(response.body).to.have.property("name", "new-name");
        expect(response.body)
            .to.have.property("defaultConfiguration")
            .that.deep.equals({
                key: "value"
            });
    });
});
