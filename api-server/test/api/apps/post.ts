import { expect } from "chai";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import request = require("supertest");

import { JWT_SECRET } from "config";
import getApp from "getApp";
import App from "models/App";

describe("api POST /apps", () => {
    let server: Express;
    const token = sign({ sub: "sub" }, JWT_SECRET);

    before(async () => {
        server = await getApp();
        await App.destroy({ where: {} });
        await App.create({ id: "1", name: "1" });
    });

    it("400 on invalid request body", () => {
        // We just test one case in which the body is invalid (missing property
        // name), to test that validation is indeed working. We do not test all
        // validation cases, since validation is expressed declaratively
        return request(server)
            .post("/apps")
            .set("Authorization", `Bearer ${token}`)
            .send({})
            .expect(400);
    });

    it("409 on existing app with the same name", () => {
        return request(server)
            .post("/apps")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "1" })
            .expect(409);
    });

    it("201 on app created, creates and returns the app", async () => {
        const response = await request(server)
            .post("/apps")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "2" })
            .expect(201);
        const app = await App.findOne({ where: { name: "2" } });
        expect(app).not.to.equal(null);
        expect(response.body.id).to.deep.equal((app as App).id);
    });
});
