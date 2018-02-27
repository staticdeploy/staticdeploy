import express from "express";
import request from "supertest";

import healthCheck from "middleware/healthCheck";

const server = express()
    .use(healthCheck({ healthChecks: [], hostname: "health-domain.com" }))
    .all("*", (_req, res) => res.status(200).send("NOT HANDLED"));

describe("middleware healthCheck", () => {
    it("doesn't handle the request when req.hostname != configured health hostname", () => {
        return request(server)
            .get("/health")
            .expect(200)
            .expect("NOT HANDLED");
    });
    it("doesn't handle the request when req.path != /health", () => {
        return request(server)
            .get("/not-health")
            .set("Host", "health-domain.com")
            .expect(200)
            .expect("NOT HANDLED");
    });
    it("runs the healthcheck and returns its result when req.path == /health and req.hostname == configured health hostname", () => {
        return request(server)
            .get("/health")
            .set("Host", "health-domain.com")
            .expect(200)
            .expect({ isHealthy: true });
    });
});
