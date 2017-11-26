import { expect } from "chai";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import request = require("supertest");

import { JWT_SECRET } from "config";
import getApp from "getApp";
import App from "models/App";
import Entrypoint from "models/Entrypoint";

describe("api DELETE /entrypoints/:entrypointId", () => {
    let server: Express;
    const token = sign({ sub: "sub" }, JWT_SECRET);

    before(async () => {
        server = await getApp();
        await Entrypoint.destroy({ where: {} });
        await App.destroy({ where: {} });
        await App.create({ id: "1", name: "1" });
        await Entrypoint.create({ id: "1", appId: "1", urlMatcher: "1" });
    });

    it("404 on entrypoint not found", () => {
        return request(server)
            .delete("/entrypoints/2")
            .set("Authorization", `Bearer ${token}`)
            .expect(404);
    });

    it("204 on entrypoint deleted, deletes the entrypoint", async () => {
        await request(server)
            .delete("/entrypoints/1")
            .set("Authorization", `Bearer ${token}`)
            .expect(204);
        const entrypoint = await Entrypoint.findById("1");
        expect(entrypoint).to.equal(null);
    });
});
