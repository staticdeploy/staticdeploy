import chai from "chai";
import chaiFuzzy from "chai-fuzzy";

import storage from "services/storage";

chai.use(chaiFuzzy);

export interface IData {
    apps?: { name: string }[];
    entrypoints?: {
        appId: string | number;
        bundleId?: string | number;
        urlMatcher: string;
    }[];
    bundles?: { name: string; tag: string }[];
    operationLogs?: {}[];
}

export interface IIds {
    apps: string[];
    entrypoints: string[];
    bundles: string[];
    operationLogs: string[];
}

export async function insertFixtures(data: IData): Promise<IIds> {
    // Setup and/or reset database
    await storage.setup();
    // Deleting all apps results in all entrypoints being deleted as well
    const apps = await storage.apps.findAll();
    for (const app of apps) {
        await storage.apps.delete(app.id);
    }
    const bundles = await storage.bundles.findAll();
    for (const bundle of bundles) {
        await storage.bundles.delete(bundle.id);
    }
    const operationLogs = await storage.operationLogs.findAll();
    for (const operationLog of operationLogs) {
        await storage.operationLogs.delete(operationLog.id);
    }

    const ids: IIds = {
        apps: [],
        entrypoints: [],
        bundles: [],
        operationLogs: []
    };

    // Insert provided database fixtures
    for (const bundle of data.bundles || []) {
        const { id } = await storage.bundles.create({
            ...bundle,
            description: "description",
            content: Buffer.from("")
        });
        ids.bundles.push(id);
    }
    for (const app of data.apps || []) {
        const { id } = await storage.apps.create(app);
        ids.apps.push(id);
    }
    for (const entrypoint of data.entrypoints || []) {
        const { appId, bundleId } = entrypoint;
        const { id } = await storage.entrypoints.create({
            ...entrypoint,
            appId: typeof appId === "number" ? ids.apps[appId] : appId,
            bundleId:
                typeof bundleId === "number" ? ids.bundles[bundleId] : bundleId
        });
        ids.entrypoints.push(id);
    }
    for (const operationLog of data.operationLogs || []) {
        const { id } = await storage.operationLogs.create({
            operation: "operation",
            parameters: {},
            performedBy: "performedBy",
            ...operationLog
        });
        ids.operationLogs.push(id);
    }

    return ids;
}
