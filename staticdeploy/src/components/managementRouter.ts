import { managementApiAdapter } from "@staticdeploy/http-adapters";
import serveStatic from "@staticdeploy/serve-static";
import express from "express";
import { dirname } from "path";

import IConfig from "../common/IConfig";
import removeUndefs from "../common/removeUndefs";

export default async (config: IConfig): Promise<express.Router> => {
    if (!config.enableManagementEndpoints) {
        return express.Router().use((_req, res) => {
            res.status(404).send({
                message: "Management endpoints not enabled",
            });
        });
    }
    const managementConsoleStaticServer = await serveStatic({
        root: dirname(require.resolve("@staticdeploy/management-console")),
        fallbackAssetPath: "/index.html",
        fallbackStatusCode: 200,
        configuration: removeUndefs({
            API_URL:
                config.managementHostname === "localhost"
                    ? `http://localhost:${config.port}/api`
                    : `//${config.managementHostname}/api`,
            AUTH_ENFORCED: config.enforceAuth.toString(),
            OIDC_ENABLED: (
                !!config.oidcConfigurationUrl && !!config.oidcClientId
            ).toString(),
            OIDC_CONFIGURATION_URL: config.oidcConfigurationUrl,
            OIDC_CLIENT_ID: config.oidcClientId,
            OIDC_REDIRECT_URL:
                config.managementHostname === "localhost"
                    ? `http://localhost:${config.port}`
                    : `https://${config.managementHostname}`,
            OIDC_PROVIDER_NAME: config.oidcProviderName,
            JWT_ENABLED: (!!config.jwtSecretOrPublicKey).toString(),
        }),
        headers: {},
    });

    return express
        .Router()
        .use(
            "/api",
            managementApiAdapter({
                serviceName: config.appName,
                serviceVersion: config.appVersion,
                serviceHost: config.managementHostname,
                serviceBasePath: "/api",
                maxRequestBodySize: config.maxRequestBodySize,
            })
        )
        .use(managementConsoleStaticServer);
};
