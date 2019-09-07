import axios, { AxiosResponse } from "axios";
import jwtDecode from "jwt-decode";
import nanoid from "nanoid";

import IAuthStrategy from "./IAuthStrategy";

interface IOpenidConfiguration {
    authorization_endpoint: string;
}

const AUTH_TOKEN_STORAGE_KEY = "oidc:authToken";
const NONCE_STORAGE_KEY = "oidc:nonce";

export default class OidcAuthStrategy implements IAuthStrategy {
    name = "oidc";

    constructor(
        private openidConfigurationUrl: string,
        private clientId: string,
        private redirectUrl: string
    ) {}

    async login(): Promise<void> {
        // Fetch the openid configuration
        let response: AxiosResponse<IOpenidConfiguration>;
        try {
            response = await axios.get<IOpenidConfiguration>(
                this.openidConfigurationUrl
            );
        } catch {
            throw new Error("Error retrieving openid configuration");
        }

        const nonce = nanoid();
        localStorage.setItem(NONCE_STORAGE_KEY, nonce);

        // Redirect the user to the provider authorization endpoint
        window.location.href = axios.getUri({
            url: response.data.authorization_endpoint,
            params: {
                client_id: this.clientId,
                redirect_uri: this.redirectUrl,
                response_type: "id_token",
                scope: "openid",
                nonce: nonce
            }
        });
    }

    async logout(): Promise<void> {
        window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    }

    getAuthToken(): string | null {
        try {
            const search = new URLSearchParams(
                window.location.hash.replace(/^#/, "")
            );
            const idTokenInUrl = search.get("id_token");
            if (idTokenInUrl) {
                const jwt = jwtDecode<{ nonce?: string }>(idTokenInUrl);
                const nonce = localStorage.getItem(NONCE_STORAGE_KEY);
                if (nonce && jwt.nonce === nonce) {
                    window.localStorage.setItem(
                        AUTH_TOKEN_STORAGE_KEY,
                        idTokenInUrl
                    );
                }
            }
            return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
        } catch {
            // If errors occur, just return null
            return null;
        }
    }
}
