import { createTree, destroyTree } from "create-fs-tree";
import express from "express";
import { tmpdir } from "os";
import { join } from "path";
import request from "supertest";

import serveStatic from "../src";

describe("serveStatic middleware", () => {
    const directoryPath = join(tmpdir(), "staticdeploy/serve-static");
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

    it("serves a local directory using StaticDeploy's serving algorithm", async () => {
        const server = express().use(
            await serveStatic({
                root: directoryPath,
                fallbackAssetPath: "/404.html",
                fallbackStatusCode: 404,
                configuration: { key: "value" },
                headers: {
                    "**": { "x-custom-header": "value" }
                }
            })
        );
        await request(server)
            .get("/index.html")
            .expect(200)
            .expect("content-type", /text\/html/)
            .expect("x-custom-header", "value")
            .expect(/{"key":"value"}/);
        await request(server)
            .get("/js/index.js")
            .expect(200)
            .expect("content-type", /application\/javascript/)
            .expect("x-custom-header", "value")
            .expect("index.js");
        await request(server)
            .get("/deeply/nested/file")
            .expect(200)
            .expect("content-type", /application\/octet-stream/)
            .expect("x-custom-header", "value")
            .expect(Buffer.from("file"));
        await request(server)
            .get("/non-existing/file")
            .expect(404)
            .expect("content-type", /text\/html/)
            .expect("x-custom-header", "value")
            .expect(/Not found/);
    });

    it("can be mounted at a non-root path", async () => {
        const server = express().use(
            "/base/path",
            await serveStatic({
                root: directoryPath,
                fallbackAssetPath: "/404.html",
                fallbackStatusCode: 404,
                configuration: { key: "value" },
                headers: {
                    "**": { "x-custom-header": "value" }
                }
            })
        );
        await request(server)
            .get("/base/path/index.html")
            .expect(200)
            .expect("content-type", /text\/html/)
            .expect("x-custom-header", "value")
            .expect(/{"key":"value"}/);
        await request(server)
            .get("/base/path/js/index.js")
            .expect(200)
            .expect("content-type", /application\/javascript/)
            .expect("x-custom-header", "value")
            .expect("index.js");
        await request(server)
            .get("/base/path/deeply/nested/file")
            .expect(200)
            .expect("content-type", /application\/octet-stream/)
            .expect("x-custom-header", "value")
            .expect(Buffer.from("file"));
        await request(server)
            .get("/base/path/non-existing/file")
            .expect(404)
            .expect("content-type", /text\/html/)
            .expect("x-custom-header", "value")
            .expect(/Not found/);
    });
});
