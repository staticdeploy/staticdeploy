import { LogLevelString } from "bunyan";

export default interface IConfig {
    // General service configurations
    appName: string;
    appVersion: string;
    nodeEnv: string;
    logLevel: LogLevelString;
    port: string;

    // Routing configuration
    adminHostname: string;
    hostnameHeader?: string;

    // Auth configurations
    jwtSecret: Buffer;

    // pg-s3-storages configurations
    postgresUrl?: string;
    s3Bucket?: string;
    s3Endpoint?: string;
    s3AccessKeyId?: string;
    s3SecretAccessKey?: string;
}
