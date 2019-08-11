import { JSONWebKeySet, JWKS, JWT } from "@panva/jose";
import {
    AuthenticationStrategySetupError,
    IAuthenticationStrategy,
    IIdpUser
} from "@staticdeploy/core";
import axios from "axios";

interface IOpenidConfiguration {
    issuer: string;
    jwks_uri: string;
}

export default class OidcAuthenticationStrategy
    implements IAuthenticationStrategy {
    private openidConfiguration!: IOpenidConfiguration;
    private keyStore!: JWKS.KeyStore;

    constructor(
        private openidConfigurationUrl: string,
        private clientId: string
    ) {}

    async setup() {
        await this.fetchOpenidConfiguration();
        await this.fetchJwks();
    }

    async getIdpUserFromAuthToken(authToken: string): Promise<IIdpUser | null> {
        try {
            const jwt = JWT.verify(authToken, this.keyStore, {
                issuer: this.openidConfiguration.issuer,
                audience: this.clientId
            }) as { sub: string; iss: string };
            return { idp: jwt.iss, id: jwt.sub };
        } catch {
            // When errors occur, we simply return a null idp user
            return null;
        }
    }

    private async fetchOpenidConfiguration(): Promise<void> {
        try {
            const { data } = await axios.get<IOpenidConfiguration>(
                this.openidConfigurationUrl
            );
            this.openidConfiguration = data;
        } catch (err) {
            throw new AuthenticationStrategySetupError(
                OidcAuthenticationStrategy.name,
                "Error fetching openid configuration",
                err
            );
        }
    }
    private async fetchJwks(): Promise<void> {
        try {
            const { data } = await axios.get<JSONWebKeySet>(
                this.openidConfiguration!.jwks_uri
            );
            this.keyStore = JWKS.asKeyStore(data);
        } catch (err) {
            throw new AuthenticationStrategySetupError(
                OidcAuthenticationStrategy.name,
                "Error fetching jwks",
                err
            );
        }
    }
}
