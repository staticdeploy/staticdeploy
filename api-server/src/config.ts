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
export const HOSTNAME = env("HOSTNAME", { default: "localhost" });
export const PORT = env("PORT", { default: "3000" });
export const HOST = `${HOSTNAME}:${PORT}`;
export const HEALTH_ROUTE_ACCESS_TOKEN = env("HEALTH_ROUTE_ACCESS_TOKEN");

// Auth configurations
export const JWT_SECRET = env("JWT_SECRET", {
    default: "secret",
    parse: Buffer.from
});

// Storage configurations
export const DATABASE_URL = env("DATABASE_URL", {
    default: "sqlite://:memory:"
});
export const S3_BUCKET = env("S3_BUCKET", {
    default: "staticdeploy"
});
export const S3_ENDPOINT = env("S3_ENDPOINT", {
    default: "http://localhost:4578"
});
export const S3_ACCESS_KEY_ID = env("S3_ACCESS_KEY_ID", {
    default: "accessKeyId"
});
export const S3_SECRET_ACCESS_KEY = env("S3_SECRET_ACCESS_KEY", {
    default: "secretAccessKey"
});
