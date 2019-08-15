import tarArchiver from "@staticdeploy/tar-archiver";
import request from "supertest";

import usecases from "../../src/common/usecases";
import getExpressApp from "../../src/components/expressApp";
import getLogger from "../../src/components/logger";
import getManagementRouter from "../../src/components/managementRouter";
import getStoragesModule from "../../src/components/storagesModule";
import config from "../../src/config";

describe("staticdeploy expressApp", () => {
    describe("when config.enableManagementEndpoints === true", () => {
        it("serves the management console at $HOST/", async () => {
            const logger = getLogger(config);
            const expressApp = getExpressApp({
                config: config,
                authenticationStrategies: [],
                storagesModule: getStoragesModule(config, logger),
                managementRouter: await getManagementRouter(config),
                usecases: usecases,
                logger: logger
            });
            return request(expressApp)
                .get("/")
                .set("host", config.managementHostname)
                .expect(200)
                .expect(/StaticDeploy Management Console/);
        });

        it("serves the management API at $HOST/api/", async () => {
            const logger = getLogger(config);
            const expressApp = getExpressApp({
                config: config,
                authenticationStrategies: [],
                storagesModule: getStoragesModule(config, logger),
                managementRouter: await getManagementRouter(config),
                usecases: usecases,
                logger: logger
            });
            return request(expressApp)
                .get("/api/health")
                .set("host", config.managementHostname)
                .expect(200)
                .expect({ isHealthy: true });
        });
    });

    describe("when config.enableManagementEndpoints === false", () => {
        it("doesn't serve the management console at $HOST/", async () => {
            const logger = getLogger(config);
            const expressApp = getExpressApp({
                config: config,
                authenticationStrategies: [],
                storagesModule: getStoragesModule(config, logger),
                managementRouter: await getManagementRouter({
                    ...config,
                    enableManagementEndpoints: false
                }),
                usecases: usecases,
                logger: logger
            });
            return request(expressApp)
                .get("/")
                .set("host", config.managementHostname)
                .expect(404);
        });

        it("doesn't serve the management API at $HOST/api/", async () => {
            const logger = getLogger(config);
            const expressApp = getExpressApp({
                config: config,
                authenticationStrategies: [],
                storagesModule: getStoragesModule(config, logger),
                managementRouter: await getManagementRouter({
                    ...config,
                    enableManagementEndpoints: false
                }),
                usecases: usecases,
                logger: logger
            });
            return request(expressApp)
                .get("/api/health")
                .set("host", config.managementHostname)
                .expect(404);
        });
    });

    it("serves deployed bundles at $ENDPOINT", async () => {
        const logger = getLogger(config);
        const expressApp = getExpressApp({
            config: config,
            authenticationStrategies: [],
            storagesModule: getStoragesModule(config, logger),
            managementRouter: await getManagementRouter(config),
            usecases: usecases,
            logger: logger
        });
        // Create a bundle
        await request(expressApp)
            .post("/api/bundles")
            .set("host", config.managementHostname)
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
        await request(expressApp)
            .post("/api/deploy")
            .set("host", config.managementHostname)
            .send({
                appName: "test",
                entrypointUrlMatcher: "example.com/",
                bundleNameTagCombination: "test:test"
            })
            .expect(204);
        // Verify the bundle is deployed
        await request(expressApp)
            .get("/")
            .set("host", "example.com")
            .expect(200)
            .expect(/test html/);
    });
});
