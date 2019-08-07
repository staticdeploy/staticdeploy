import { expect } from "chai";
import express from "express";
import { sign } from "jsonwebtoken";
import request from "supertest";

import authenticateRequest from "../../src/middleware/authenticateRequest";

const JWT_SECRET = Buffer.from("secret");
const server = express()
    .use(authenticateRequest(JWT_SECRET))
    .get("/", (_req, res) => res.status(200).send("OK"));

describe("middleware authenticateRequest", () => {
    it("401 on incorrect jwt", () => {
        return request(server)
            .get("/")
            .set("Authorization", "Bearer not-a-jwt")
            .expect(401)
            .expect({ message: "jwt malformed" });
    });

    it("401 on invalid jwt signature", () => {
        const token = sign(
            { sub: "sub" } as object,
            Buffer.from("different secret")
        );
        return request(server)
            .get("/")
            .set("Authorization", `Bearer ${token}`)
            .expect(401)
            .expect({ message: "invalid signature" });
    });

    it("401 on expired jwt", () => {
        const token = sign({ sub: "sub", exp: 0 } as object, JWT_SECRET);
        return request(server)
            .get("/")
            .set("Authorization", `Bearer ${token}`)
            .expect(401)
            .expect({ message: "jwt expired" });
    });

    it("401 on jwt with no sub", () => {
        const token = sign({}, JWT_SECRET);
        return request(server)
            .get("/")
            .set("Authorization", `Bearer ${token}`)
            .expect(401)
            .expect({ message: "jwt must specify a subject (sub)" });
    });

    it("no 401 on no jwt", () => {
        return request(server)
            .get("/")
            .expect(200)
            .expect("OK");
    });

    it("no 401 on valid token", () => {
        const token = sign({ sub: "sub" } as object, JWT_SECRET);
        return request(server)
            .get("/")
            .set("Authorization", `Bearer ${token}`)
            .expect(200)
            .expect("OK");
    });

    it("adds the idpUser property to the request object", async () => {
        const token = sign({ sub: "sub", iss: "iss" } as object, JWT_SECRET);
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
        expect(requestObject).to.have.nested.property("idpUser.id", "sub");
        expect(requestObject).to.have.nested.property("idpUser.idp", "iss");
    });
});
