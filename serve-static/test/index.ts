import { createTree, destroyTree } from "create-fs-tree";
import express from "express";
import { tmpdir } from "os";
import { join } from "path";
import request from "supertest";

import serveStatic from "../src";

describe("serveStatic middleware", () => {
    const directoryPath = join(tmpdir(), "staticdeploy/serve-static");
    const baseServeStaticOptions = {
        root: directoryPath,
        fallbackAssetPath: "/index.html",
        fallbackStatusCode: 200,
        configuration: {},
        headers: {}
    };

    before(() => {
        createTree(directoryPath, {
            "index.html": `
                <!doctype html>
                <head>
                    <title>Test page</title>
                    <script id="app-config"></script>
                </head>
                <body>
                    Test page
                </body>
            `,
            "404.html": `
                <!doctype html>
                <head>
                    <title>Not found</title>
                </head>
            `,
            js: {
                "index.js": "index.js"
            },
            deeply: {
                nested: {
                    file: "file"
                }
            }
        });
    });
    after(() => {
        destroyTree(directoryPath);
    });

    describe("serves a local directory using StaticDeploy's serving algorithm, that", () => {
        describe("serves assets", () => {
            it("case: mount path = /", async () => {
                const server = express().use(
                    await serveStatic({
                        ...baseServeStaticOptions,
                        basePath: "/"
                    })
                );
                await request(server)
                    .get("/js/index.js")
                    .expect(200)
                    .expect("index.js");
                await request(server)
                    .get("/deeply/nested/file")
                    .expect(200)
                    .expect(Buffer.from("file"));
            });

            it("case: mount path = /basePath/", async () => {
                const server = express().use(
                    "/basePath/",
                    await serveStatic({
                        ...baseServeStaticOptions,
                        basePath: "/basePath/"
                    })
                );
                await request(server)
                    .get("/basePath/js/index.js")
                    .expect(200)
                    .expect("index.js");
                await request(server)
                    .get("/basePath/deeply/nested/file")
                    .expect(200)
                    .expect(Buffer.from("file"));
            });
        });

        describe("redirects to assets' canonical paths", () => {
            it("case: mount path = /", async () => {
                const server = express().use(
                    await serveStatic(baseServeStaticOptions)
                );
                return request(server)
                    .get("/prefix/js/index.js")
                    .expect(301)
                    .expect("location", "/js/index.js");
            });

            it("case: mount path = /basePath/", async () => {
                const server = express().use(
                    "/basePath/",
                    await serveStatic({
                        ...baseServeStaticOptions,
                        basePath: "/basePath/"
                    })
                );
                return request(server)
                    .get("/basePath/prefix/js/index.js")
                    .expect(301)
                    .expect("location", "/basePath/js/index.js");
            });
        });

        it("uses a fallback asset", async () => {
            const server = express().use(
                await serveStatic({
                    ...baseServeStaticOptions,
                    fallbackAssetPath: "/404.html",
                    fallbackStatusCode: 404
                })
            );
            return request(server)
                .get("/not-existing")
                .expect(404)
                .expect(/Not found/);
        });

        it("sets the correct content-type header", async () => {
            const server = express().use(
                await serveStatic(baseServeStaticOptions)
            );
            await request(server)
                .get("/")
                .expect("content-type", /text\/html/);
            await request(server)
                .get("/js/index.js")
                .expect("content-type", /application\/javascript/);
            await request(server)
                .get("/deeply/nested/file")
                .expect("content-type", /application\/octet-stream/);
        });

        it("sets custom headers", async () => {
            const server = express().use(
                await serveStatic({
                    ...baseServeStaticOptions,
                    headers: { "**": { "x-custom": "x-custom" } }
                })
            );
            return request(server)
                .get("/")
                .expect("x-custom", "x-custom");
        });

        it("configures html files", async () => {
            const server = express().use(
                await serveStatic({
                    ...baseServeStaticOptions,
                    configuration: { key: "value" }
                })
            );
            return request(server)
                .get("/")
                .expect(/{"key":"value","BASE_PATH":"\/"}/);
        });
    });
});
