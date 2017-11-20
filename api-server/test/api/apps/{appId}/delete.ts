import { expect } from "chai";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import request = require("supertest");

import { JWT_SECRET } from "config";
import getApp from "getApp";
import App from "models/App";

describe("api DELETE /apps/:appId", () => {
    let server: Express;
    const token = sign({ sub: "sub" }, JWT_SECRET);

    before(async () => {
        server = await getApp();
        await App.destroy({ where: {} });
        await App.create({ id: "app", name: "app" });
    });

    it("404 on app not found", () => {
        return request(server)
            .delete("/apps/non-existing")
            .set("Authorization", `Bearer ${token}`)
            .expect(404);
    });

    it("204 on app deleted, deletes the app", async () => {
        await request(server)
            .delete("/apps/app")
            .set("Authorization", `Bearer ${token}`)
            .expect(204);
        const app = await App.findOne({ where: { id: "app" } });
        expect(app).to.equal(null);
    });
});
