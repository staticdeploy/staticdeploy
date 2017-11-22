import { expect } from "chai";
import express = require("express");
import { sign } from "jsonwebtoken";
import request = require("supertest");

import { JWT_SECRET } from "config";
import authenticateRequest from "middleware/authenticateRequest";

const server = express()
    .use(authenticateRequest(JWT_SECRET))
    .get("/", (_req, res) => res.status(200).send("OK"));

describe("middleware authenticateRequest", () => {
    it("401 on no jwt", () => {
        return request(server)
            .get("/")
            .expect(401)
            .expect({ message: "No authorization token was found" });
    });

    it("401 on incorrect jwt", () => {
        return request(server)
            .get("/")
            .set("Authorization", "Bearer not-a-jwt")
            .expect(401)
            .expect({ message: "jwt malformed" });
    });

    it("401 on invalid jwt signature", () => {
        const token = sign({ sub: "sub" }, Buffer.from("different secret"));
        return request(server)
            .get("/")
            .set("Authorization", `Bearer ${token}`)
            .expect(401)
            .expect({ message: "invalid signature" });
    });

    it("401 on expired jwt", () => {
        const token = sign({ sub: "sub", exp: 0 }, JWT_SECRET);
        return request(server)
            .get("/")
            .set("Authorization", `Bearer ${token}`)
            .expect(401)
            .expect({ message: "jwt expired" });
    });

    it("no 401 on valid token", () => {
        const token = sign({ sub: "sub" }, JWT_SECRET);
        return request(server)
            .get("/")
            .set("Authorization", `Bearer ${token}`)
            .expect(200)
            .expect("OK");
    });

    it("adds the user property to the request object", async () => {
        const token = sign({ sub: "sub" }, JWT_SECRET);
        let requestObject: any;
        const srv = express()
            .use(authenticateRequest(JWT_SECRET))
            .get("/", (req, res) => {
                requestObject = req;
                res.status(200).send("OK");
            });
        await request(srv)
            .get("/")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(requestObject).to.have.nested.property("user.sub", "sub");
    });
});
