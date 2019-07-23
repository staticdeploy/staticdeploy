import env from "@mondora/env";
import { LogLevelString } from "bunyan";

import IConfig from "./common/IConfig";

const pkg = require("../package.json");

const config: IConfig = {
    // General service configurations
    appName: pkg.name,
    appVersion: pkg.version,
    nodeEnv: env("NODE_ENV", { default: "development" }),
    logLevel: env("LOG_LEVEL", {
        default: "info"
    }) as LogLevelString,
    port: env("PORT", { default: "3000" }),

    // Routing configuration
    managementHostname: env("MANAGEMENT_HOSTNAME", {
        required: true,
        nonProductionDefault: "localhost"
    }),
    hostnameHeader: env("HOSTNAME_HEADER"),

    // Auth configurations
    jwtSecret: env("JWT_SECRET", {
        required: true,
        nonProductionDefault: "secret",
        parse: Buffer.from
    }),

    // pg-s3-storages configurations
    postgresUrl: env("POSTGRES_URL"),
    s3Bucket: env("S3_BUCKET"),
    s3Endpoint: env("S3_ENDPOINT"),
    s3AccessKeyId: env("S3_ACCESS_KEY_ID"),
    s3SecretAccessKey: env("S3_SECRET_ACCESS_KEY")
};
export default config;
