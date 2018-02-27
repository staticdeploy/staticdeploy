import bunyanMiddleware from "bunyan-middleware";
import express from "express";

import * as config from "config";
import storageHC from "healthChecks/storage";
import healthCheck from "middleware/healthCheck";
import logger from "services/logger";
import storage from "services/storage";
import staticRoute from "staticRoute";

export default async function getApp(): Promise<express.Express> {
    // Init storage
    await storage.setup();
    return express()
        .use(bunyanMiddleware({ logger }))
        .use(
            healthCheck({
                healthChecks: [storageHC],
                accessToken: config.HEALTH_ROUTE_ACCESS_TOKEN,
                hostname: config.HEALTH_ROUTE_HOSTNAME
            })
        )
        .get(/.*/, staticRoute);
}
