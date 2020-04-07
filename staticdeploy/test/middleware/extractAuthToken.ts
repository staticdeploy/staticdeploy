import express from "express";
import request from "supertest";

import IRequestWithAuthToken from "../../src/common/IRequestWithAuthToken";
import extractAuthToken from "../../src/middleware/extractAuthToken";

const server = express()
    .use(extractAuthToken())
    .get("/", (req: IRequestWithAuthToken, res) =>
        res.status(200).send({ authToken: req.authToken })
    );

describe("middleware extractAuthToken", () => {
    describe("extracts bearer tokens in the authorization header", () => {
        it("case: capitalized Bearer", () => {
            return request(server)
                .get("/")
                .set("authorization", "Bearer authToken")
                .expect(200)
                .expect({ authToken: "authToken" });
        });

        it("case: lowercase bearer", () => {
            return request(server)
                .get("/")
                .set("authorization", "bearer authToken")
                .expect(200)
                .expect({ authToken: "authToken" });
        });
    });

    it("extracts null otherwise", () => {
        return request(server).get("/").expect(200).expect({ authToken: null });
    });
});
