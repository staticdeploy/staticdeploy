import bunyanMiddleware = require("bunyan-middleware");
import convexpress = require("convexpress");
import express = require("express");
import { healthRoute } from "express-healthchecker";

import exec from "common/exec";
import * as config from "config";
import * as databaseHC from "healthChecks/database";
import authenticateRequest from "middleware/authenticateRequest";
import logger from "services/logger";
import { migrate } from "services/migrator";

export default async function getApp(): Promise<express.Express> {
    // Init database
    await migrate();

    // Init filesystem
    await exec(`mkdir -p ${config.DEPLOYMENTS_PATH}`);

    // Build convexpress router
    const options = {
        info: {
            title: config.APP_NAME,
            version: config.APP_VERSION
        },
        host: config.HOST,
        bodyParserOptions: {
            limit: "100mb",
            strict: false
        }
    };
    const router = convexpress(options)
        .get(
            "/health",
            healthRoute({
                healthChecks: [databaseHC],
                accessToken: config.HEALTH_ROUTE_ACCESS_TOKEN
            })
        )
        .serveSwagger()
        .use(bunyanMiddleware({ logger }))
        .use(authenticateRequest(config.JWT_SECRET))
        .loadFrom(`${__dirname}/api/**/*.@(ts|js)`);

    // Return express app
    return express().use(router);
}
