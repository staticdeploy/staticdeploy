import bunyanMiddleware = require("bunyan-middleware");
import convexpress = require("convexpress");
import express = require("express");
import { healthRoute } from "express-healthchecker";

import * as config from "config";
import * as databaseHC from "healthChecks/database";
import authenticateRequest from "middleware/authenticateRequest";
import logger from "services/logger";
import sequelize from "services/sequelize";

export default async function getApp(): Promise<express.Express> {
    await sequelize.sync({});
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
    return express().use(
        convexpress(options)
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
            .loadFrom(`${__dirname}/api/**/*.@(ts|js)`)
    );
}
