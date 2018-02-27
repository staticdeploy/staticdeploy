import { IConfiguration } from "@staticdeploy/storage";
import chai from "chai";
import chaiFuzzy from "chai-fuzzy";
import { createTree, destroyTree, IDefinition } from "create-fs-tree";
import express from "express";
import { removeSync } from "fs-extra";
import { readFileSync } from "mz/fs";
import os from "os";
import path from "path";
import request from "supertest";
import tar from "tar";

import getApp from "getApp";
import storage from "services/storage";

chai.use(chaiFuzzy);

interface IData {
    apps?: { name: string; defaultConfiguration?: IConfiguration }[];
    entrypoints?: {
        appId: string;
        urlMatcher: string;
        configuration?: IConfiguration;
    }[];
    deployments?: { entrypointId: string; content: Buffer }[];
}

interface IIds {
    apps: string[];
    deployments: string[];
    entrypoints: string[];
}

async function insertFixtures(data: IData): Promise<IIds> {
    // Setup and/or reset database
    await storage.setup();
    const apps = await storage.apps.findAll();
    for (const app of apps) {
        await storage.apps.delete(app.id);
    }

    const ids: IIds = {
        apps: [],
        deployments: [],
        entrypoints: []
    };
    // Insert provided database fixtures
    for (const app of data.apps || []) {
        const { id } = await storage.apps.create(app);
        ids.apps.push(id);
    }
    for (const entrypoint of data.entrypoints || []) {
        const { appId } = entrypoint;
        const { id } = await storage.entrypoints.create({
            ...entrypoint,
            appId: /^\$/.test(appId) ? ids.apps[parseInt(appId.slice(1), 10)] : appId
        });
        ids.entrypoints.push(id);
    }
    for (const deployment of data.deployments || []) {
        const { entrypointId } = deployment;
        const { id } = await storage.deployments.create({
            entrypointId: /^\$/.test(entrypointId)
                ? ids.entrypoints[parseInt(entrypointId.slice(1), 10)]
                : entrypointId,
            content: deployment.content
        });
        ids.deployments.push(id);
    }
    return ids;
}

function targzOf(definition: IDefinition): Buffer {
    const contentPath = path.join(os.tmpdir(), "content");
    const contentTargzPath = path.join(os.tmpdir(), "content.tar.gz");
    createTree(contentPath, definition);
    tar.create({ cwd: contentPath, file: contentTargzPath, sync: true }, ["."]);
    destroyTree(contentPath);
    const contentTargz = readFileSync(contentTargzPath);
    removeSync(contentTargzPath);
    return contentTargz;
}

export interface ITestDefinition {
    only?: boolean;
    entrypoints: {
        urlMatcher: string;
        deploymentContent?: IDefinition;
        configuration?: IConfiguration;
        defaultConfiguration?: IConfiguration;
    }[];
    testCases: {
        only?: boolean;
        requestedUrl: string;
        expectedStatusCode: number;
        expectedBody?: string | ((body: string) => any);
        expectedLocation?: string;
    }[];
}

export function test(description: string, testDefinition: ITestDefinition) {
    const { entrypoints, testCases } = testDefinition;
    const describeFn = testDefinition.only ? describe.only : describe;
    describeFn(description, () => {
        let server: express.Express;
        before(async () => {
            server = await getApp();
            const ids = await insertFixtures({
                apps: entrypoints.map((entrypoint, index) => ({
                    name: index.toString(),
                    defaultConfiguration: entrypoint.defaultConfiguration
                })),
                entrypoints: entrypoints.map((entrypoint, index) => ({
                    appId: `$${index}`,
                    urlMatcher: entrypoint.urlMatcher,
                    configuration: entrypoint.configuration
                })),
                deployments: entrypoints
                    .filter(entrypoint => entrypoint.deploymentContent)
                    .map((entrypoint, index) => ({
                        entrypointId: `$${index}`,
                        content: targzOf(entrypoint.deploymentContent!)
                    }))
            });
            for (let i = 0; i < ids.entrypoints.length; i++) {
                await storage.entrypoints.update(ids.entrypoints[i], {
                    activeDeploymentId: ids.deployments[i]
                });
            }
        });
        testCases.forEach(testCase => {
            const { requestedUrl, expectedStatusCode, expectedBody, expectedLocation } = testCase;
            const firstSlash = requestedUrl.indexOf("/");
            const requestedDomain = requestedUrl.slice(0, firstSlash);
            const requestedPath = requestedUrl.slice(firstSlash);
            const andCorrectBody = expectedBody ? " and correct body" : "";
            const andCorrectLocation = expectedLocation ? " and correct location" : "";
            const itFn = testCase.only ? it.only : it;
            itFn(
                `case: ${expectedStatusCode}${andCorrectBody}${andCorrectLocation} when requesting ${requestedUrl}`,
                () => {
                    let t = request(server)
                        .get(requestedPath)
                        .set("Host", requestedDomain)
                        .expect(expectedStatusCode);
                    if (expectedLocation) {
                        t = t.expect("Location", expectedLocation);
                    }
                    if (expectedBody) {
                        t = t.expect((res: request.Response) => {
                            const body = res.text || (res.body && res.body.toString());
                            if (typeof expectedBody === "function") {
                                expectedBody(body);
                            } else {
                                chai.expect(body).to.equal(expectedBody);
                            }
                        });
                    }
                    return t;
                }
            );
        });
    });
}
