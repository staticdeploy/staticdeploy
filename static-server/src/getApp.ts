import bunyanMiddleware from "bunyan-middleware";
import express from "express";

import getStaticRoute from "getStaticRoute";
import storageHC from "healthChecks/storage";
import healthCheck from "middleware/healthCheck";
import logger from "services/logger";
import storage from "services/storage";

export default async function getApp(
    config: typeof import("config")
): Promise<express.Express> {
    // Init storage
    await storage.setup();

    const app = express();

    // When present, use X-Forwarded-* headers to determine request properties
    // like the originally requested hostname
    app.set("trust proxy", true);

    return app
        .use(bunyanMiddleware({ logger }))
        .use(
            healthCheck({
                healthChecks: [storageHC],
                accessToken: config.HEALTH_ROUTE_ACCESS_TOKEN,
                hostname: config.HEALTH_ROUTE_HOSTNAME
            })
        )
        .get(/.*/, getStaticRoute({ hostnameHeader: config.HOSTNAME_HEADER }));
}
