import { expect } from "chai";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import request = require("supertest");

import { JWT_SECRET } from "config";
import getApp from "getApp";
import App from "models/App";

describe("api GET /apps", () => {
    let server: Express;
    const apps: any[] = [];
    const token = sign({ sub: "sub" }, JWT_SECRET);

    before(async () => {
        server = await getApp();
        await App.destroy({ where: {} });
        apps.push(
            await App.create({ id: "app", name: "app" }),
            await App.create({ id: "other-app", name: "other-app" })
        );
    });

    it("200 and returns all apps", async () => {
        const response = await request(server)
            .get("/apps")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(response.body).to.have.length(2);
        expect(response.body.map((app: App) => app.id)).to.deep.equal([
            "app",
            "other-app"
        ]);
    });
});
