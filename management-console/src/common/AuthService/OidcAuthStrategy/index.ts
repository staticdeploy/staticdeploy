import { UserManager, WebStorageStateStore } from "oidc-client";

import IAuthStrategy from "../IAuthStrategy";
import isAuthTokenExpired from "./isAuthTokenExpired";
import * as urlUtils from "./urlUtils";

export default class OidcAuthStrategy implements IAuthStrategy {
    // Expose as static method, as it's needed when starting the app
    static isSilentRedirectPage = urlUtils.isSilentRedirectPage;

    name = "oidc";
    displayName: string;
    private userManager: UserManager;

    constructor(
        openidConfigurationUrl: string,
        clientId: string,
        baseRedirectUrl: string,
        providerName: string
    ) {
        this.userManager = new UserManager({
            authority: openidConfigurationUrl,
            client_id: clientId,
            redirect_uri: urlUtils.getRedirectUrl(baseRedirectUrl),
            silent_redirect_uri: urlUtils.getSilentRedirectUrl(baseRedirectUrl),
            loadUserInfo: false,
            userStore: new WebStorageStateStore({ store: window.localStorage })
        });
        this.displayName = providerName;
    }

    async init() {
        if (urlUtils.isRedirectPage()) {
            await this.userManager.signinRedirectCallback().catch();
        }
        if (urlUtils.isSilentRedirectPage()) {
            await this.userManager.signinSilentCallback().catch();
        }
    }

    async login(): Promise<void> {
        await this.userManager.signinRedirect();
        // Keep "logging in" while the user is redirected to the idp
        await new Promise(() => null);
    }

    async logout(): Promise<void> {
        await this.userManager.removeUser();
    }

    async getAuthToken(): Promise<string | null> {
        if (urlUtils.isSilentRedirectPage()) {
            // We're inside the silent redirect iframe.
            //
            // Here we don't care about the auth token. However, getAuthToken
            // gets called nonetheless at the end of AuthService.init, which is
            // necessary to call this strategy's init, which in turn completes
            // the silent signing process.
            //
            // If we don't return early, the code below is executed which gets
            // the user (that still has an expired id_token), sees that the
            // id_token is expired, and starts _another_ silent signing process,
            // which is completely unnecessary and may even alter the original
            // signing process result
            return null;
        }

        let user = await this.userManager.getUser();

        if (!user) {
            return null;
        }

        if (isAuthTokenExpired(user.id_token)) {
            try {
                user = await this.userManager.signinSilent();
            } catch {
                await this.logout();
                return null;
            }
        }

        return user.id_token;
    }
}
