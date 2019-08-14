import { AuthEnforcementLevel } from "@staticdeploy/core";
import { LogLevelString } from "bunyan";

export default interface IConfig {
    // General service configurations
    appName: string;
    appVersion: string;
    nodeEnv: string;
    logLevel: LogLevelString;
    port: string;

    // Routing configuration
    managementHostname: string;
    hostnameHeader?: string;

    // Auth configurations
    authEnforcementLevel: AuthEnforcementLevel;
    createRootUser: boolean;
    jwtSecretOrPublicKey?: Buffer;
    oidcConfigurationUrl?: string;
    oidcClientId?: string;
    oidcProviderName?: string;

    // pg-s3-storages configurations
    postgresUrl?: string;
    s3Bucket?: string;
    s3Endpoint?: string;
    s3AccessKeyId?: string;
    s3SecretAccessKey?: string;
}
