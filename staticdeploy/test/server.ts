import tarArchiver from "@staticdeploy/tar-archiver";
import { sign } from "jsonwebtoken";
import request from "supertest";

import usecases from "../src/common/usecases";
import config from "../src/config";
import getExpressApp from "../src/getExpressApp";
import getLogger from "../src/services/logger";
import getStoragesModule from "../src/services/storagesModule";

describe("staticdeploy server", () => {
    it("serves the admin console at $HOST/", async () => {
        const logger = getLogger(config);
        const app = await getExpressApp({
            config: config,
            storagesModule: getStoragesModule(config, logger),
            usecases: usecases,
            logger: logger
        });
        return request(app)
            .get("/")
            .set("host", config.adminHostname)
            .expect(200)
            .expect(/StaticDeploy Admin Console/);
    });

    it("serves the admin api at $HOST/api/", async () => {
        const logger = getLogger(config);
        const app = await getExpressApp({
            config: config,
            storagesModule: getStoragesModule(config, logger),
            usecases: usecases,
            logger: logger
        });
        return request(app)
            .get("/api/health")
            .set("host", config.adminHostname)
            .expect(200)
            .expect({ isHealthy: true });
    });

    it("serves deployed bundles at $ENDPOINT", async () => {
        const logger = getLogger(config);
        const app = await getExpressApp({
            config: config,
            storagesModule: getStoragesModule(config, logger),
            usecases: usecases,
            logger: logger
        });
        const token = sign({ sub: "sub" } as object, config.jwtSecret);
        // Create a bundle
        await request(app)
            .post("/api/bundles")
            .set("host", config.adminHostname)
            .set("authorization", `Bearer ${token}`)
            .send({
                name: "test",
                tag: "test",
                description: "test",
                content: (await tarArchiver.makeArchive([
                    { path: "/index.html", content: Buffer.from("test html") }
                ])).toString("base64"),
                fallbackAssetPath: "/index.html",
                fallbackStatusCode: 200,
                headers: {}
            })
            .expect(201);
        // Deploy the bundle
        await request(app)
            .post("/api/deploy")
            .set("host", config.adminHostname)
            .set("authorization", `Bearer ${token}`)
            .send({
                appName: "test",
                entrypointUrlMatcher: "example.com/",
                bundleNameTagCombination: "test:test"
            })
            .expect(204);
        // Verify the bundle is deployed
        await request(app)
            .get("/")
            .set("host", "example.com")
            .expect(200)
            .expect(/test html/);
    });
});
