import chai = require("chai");
import chaiFuzzy = require("chai-fuzzy");

import storage from "services/storage";

chai.use(chaiFuzzy);

export interface IData {
    apps?: { name: string }[];
    deployments?: { entrypointId: string }[];
    entrypoints?: { appId: string; urlMatcher: string }[];
}

export interface IIds {
    apps: string[];
    deployments: string[];
    entrypoints: string[];
}

export async function insertFixtures(data: IData): Promise<IIds> {
    // Setup and/or reset database
    // await storage.setup();
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
            appId: /^\$/.test(appId)
                ? ids.apps[parseInt(appId.slice(1), 10)]
                : appId
        });
        ids.entrypoints.push(id);
    }
    for (const deployment of data.deployments || []) {
        const { entrypointId } = deployment;
        const { id } = await storage.deployments.create({
            content: Buffer.from(""),
            entrypointId: /^\$/.test(entrypointId)
                ? ids.entrypoints[parseInt(entrypointId.slice(1), 10)]
                : entrypointId
        });
        ids.deployments.push(id);
    }
    return ids;
}
