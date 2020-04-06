const { APP_CONFIG } = window as any;

export default {
    // StaticdeployClient
    apiUrl: APP_CONFIG.API_URL || "http://localhost:3456",
    // General auth
    authEnforced: APP_CONFIG.AUTH_ENFORCED === "true",
    // Oidc auth strategy
    oidcEnabled: APP_CONFIG.OIDC_ENABLED === "true",
    oidcConfigurationUrl:
        APP_CONFIG.OIDC_CONFIGURATION_URL ||
        "http://localhost:3456/oidc/configuration",
    oidcClientId: APP_CONFIG.OIDC_CLIENT_ID || "clientId",
    oidcRedirectUrl: APP_CONFIG.OIDC_REDIRECT_URL || "http://localhost:3000",
    oidcProviderName: APP_CONFIG.OIDC_PROVIDER_NAME || "OpenID Connect",
    // Jwt auth strategy
    jwtEnabled: APP_CONFIG.JWT_ENABLED === "true",
};
