import env from "@mondora/env";
import { LogLevelString } from "bunyan";

// General service configurations
export const APP_NAME = "staticeploy-api-server";
export const APP_VERSION = require("../package.json").version;
export const NODE_ENV = env("NODE_ENV", { default: "development" });
export const LOG_LEVEL = env("LOG_LEVEL", {
    default: "info"
}) as LogLevelString;
export const HOSTNAME = env("HOSTNAME", { default: "localhost" });
export const PORT = env("PORT", { default: "3000" });
export const HOST = `${HOSTNAME}:${PORT}`;
export const HEALTH_ROUTE_ACCESS_TOKEN = env("HEALTH_ROUTE_ACCESS_TOKEN");

// Auth configurations
export const JWT_SECRET = env("JWT_SECRET", {
    default: "secret",
    parse: Buffer.from
});

// Database configuration
export const DATABASE_URL = env("DATABASE_URL", {
    default: "sqlite://:memory:"
});
