import { expect } from "chai";
import { Express } from "express";
import { sign } from "jsonwebtoken";
import request from "supertest";

import { JWT_SECRET } from "config";
import getApp from "getApp";
import storage from "services/storage";
import { insertFixtures } from "../../setup";

describe("api POST /deploy", () => {
    let server: Express;
    const token = sign({ sub: "sub" }, JWT_SECRET);

    beforeEach(async () => {
        server = await getApp();
        await insertFixtures({
            apps: [{ name: "0" }],
            entrypoints: [{ appId: 0, urlMatcher: "0.com/" }],
            bundles: [{ name: "0", tag: "0" }]
        });
    });

    describe("400 on invalid request body", () => {
        it("case: missing properties", () => {
            return request(server)
                .post("/deploy")
                .set("Authorization", `Bearer ${token}`)
                .send({})
                .expect(400)
                .expect(/Validation failed/);
        });
        it("case: invalid bundleNameTagCombination", () => {
            return request(server)
                .post("/deploy")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    appName: "0",
                    entrypointUrlMatcher: "0.com/",
                    bundleNameTagCombination: "non-valid"
                })
                .expect(400)
                .expect({
                    message:
                        "non-valid is not a valid name:tag combination for a bundle"
                });
        });
        it("case: invalid appName", () => {
            return request(server)
                .post("/deploy")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    appName: "*",
                    entrypointUrlMatcher: "1.com/",
                    bundleNameTagCombination: "0:0"
                })
                .expect(400)
                .expect({ message: "* is not a valid name for an app" });
        });
        it("case: invalid entrypointUrlMatcher", () => {
            return request(server)
                .post("/deploy")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    appName: "0",
                    entrypointUrlMatcher: "1.com",
                    bundleNameTagCombination: "0:0"
                })
                .expect(400)
                .expect({
                    message: "1.com is not a valid urlMatcher for an entrypoint"
                });
        });
    });

    it("404 on non-existing bundle", () => {
        return request(server)
            .post("/deploy")
            .set("Authorization", `Bearer ${token}`)
            .send({
                appName: "0",
                entrypointUrlMatcher: "0.com/",
                bundleNameTagCombination: "non-existing:non-existing"
            })
            .expect(404)
            .expect({
                message:
                    "No bundle found with name:tag combination = non-existing:non-existing"
            });
    });

    it("409 on entrypoint not linking to the app", () => {
        return request(server)
            .post("/deploy")
            .set("Authorization", `Bearer ${token}`)
            .send({
                appName: "1",
                entrypointUrlMatcher: "0.com/",
                bundleNameTagCombination: "0:0"
            })
            .expect(409)
            .expect({
                message:
                    "Entrypoint with urlMatcher = 0.com/ doesn't link to app with name = 1"
            });
    });

    it("204 and creates app and entrypoint if they don't exist", async () => {
        await request(server)
            .post("/deploy")
            .set("Authorization", `Bearer ${token}`)
            .send({
                appName: "1",
                entrypointUrlMatcher: "1.com/",
                bundleNameTagCombination: "0:0"
            })
            .expect(204);
        const app = await storage.apps.findOneByIdOrName("1");
        expect(app).not.to.equal(null);
        const entrypoint = await storage.entrypoints.findOneByIdOrUrlMatcher(
            "1.com/"
        );
        expect(entrypoint).not.to.equal(null);
    });

    it("204 and creates the entrypoint if it doesn't exist", async () => {
        await request(server)
            .post("/deploy")
            .set("Authorization", `Bearer ${token}`)
            .send({
                appName: "0",
                entrypointUrlMatcher: "1.com/",
                bundleNameTagCombination: "0:0"
            })
            .expect(204);
        const app = await storage.apps.findOneByIdOrName("0");
        const entrypoint = await storage.entrypoints.findOneByIdOrUrlMatcher(
            "1.com/"
        );
        expect(entrypoint).not.to.equal(null);
        expect(entrypoint!.appId).to.equal(app!.id);
    });

    it("204 and updates the entrypoint if it exist", async () => {
        await request(server)
            .post("/deploy")
            .set("Authorization", `Bearer ${token}`)
            .send({
                appName: "0",
                entrypointUrlMatcher: "0.com/",
                bundleNameTagCombination: "0:0"
            })
            .expect(204);
        const bundle = await storage.bundles.findLatestByNameTagCombination(
            "0:0"
        );
        const entrypoint = await storage.entrypoints.findOneByIdOrUrlMatcher(
            "0.com/"
        );
        expect(entrypoint!.bundleId).to.equal(bundle!.id);
    });
});
