import env from "@mondora/env";
import { LogLevelString } from "bunyan";

const pkg = require("../package.json");

// General service configurations
export const APP_NAME = pkg.name;
export const APP_VERSION = pkg.version;
export const NODE_ENV = env("NODE_ENV", { default: "development" });
export const LOG_LEVEL = env("LOG_LEVEL", {
    default: "info"
}) as LogLevelString;
export const PORT = env("PORT", { default: "3000" });
export const HEALTH_ROUTE_HOSTNAME = env("HEALTH_ROUTE_HOSTNAME");
export const HEALTH_ROUTE_ACCESS_TOKEN = env("HEALTH_ROUTE_ACCESS_TOKEN");

// Routing configuration
export const HOSTNAME_HEADER = env("HOSTNAME_HEADER");

// Storage configurations
export const DATABASE_URL = env("DATABASE_URL", {
    required: true,
    nonProductionDefault: "sqlite://:memory:"
});
export const S3_BUCKET = env("S3_BUCKET", {
    required: true,
    nonProductionDefault: "staticdeploy"
});
export const S3_ENDPOINT = env("S3_ENDPOINT", {
    required: true,
    nonProductionDefault: "http://localhost:4578"
});
export const S3_ACCESS_KEY_ID = env("S3_ACCESS_KEY_ID", {
    required: true,
    nonProductionDefault: "accessKeyId"
});
export const S3_SECRET_ACCESS_KEY = env("S3_SECRET_ACCESS_KEY", {
    required: true,
    nonProductionDefault: "secretAccessKey"
});
