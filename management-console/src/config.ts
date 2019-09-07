const { APP_CONFIG } = window as any;

export const API_URL = APP_CONFIG.API_URL || "http://localhost:3456";

export const AUTH_ENFORCEMENT_LEVEL = parseInt(
    APP_CONFIG.AUTH_ENFORCEMENT_LEVEL || "1",
    10
);

export const OIDC_ENABLED = APP_CONFIG.OIDC_ENABLED === "true";
export const OIDC_CONFIGURATION_URL =
    APP_CONFIG.OIDC_CONFIGURATION_URL ||
    "http://localhost:3456/oidc/configuration";
export const OIDC_CLIENT_ID = APP_CONFIG.OIDC_CLIENT_ID || "clientId";
export const OIDC_REDIRECT_URL =
    APP_CONFIG.OIDC_REDIRECT_URL || "http://localhost:3000";
export const OIDC_PROVIDER_NAME =
    APP_CONFIG.OIDC_PROVIDER_NAME || "OpenID Connect";

export const JWT_ENABLED = APP_CONFIG.JWT_ENABLED === "true";
