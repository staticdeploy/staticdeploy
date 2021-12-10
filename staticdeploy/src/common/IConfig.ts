import { LogLevelString } from "bunyan";

export default interface IConfig {
    // General service configurations
    appName: string;
    appVersion: string;
    nodeEnv: string;
    logLevel: LogLevelString;
    port: string;
    managementHostname: string;
    enableManagementEndpoints: boolean;
    maxRequestBodySize: string;

    // Routing configuration
    hostnameHeader?: string;

    // Auth configurations
    enforceAuth: boolean;
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
    s3GoogleCloudStorageCompatible?: boolean;
}
