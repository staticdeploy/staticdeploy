import { JSONWebKeySet, JWKS, JWT } from "@panva/jose";
import { IAuthenticationStrategy, IIdpUser } from "@staticdeploy/core";
import axios from "axios";
import Logger from "bunyan";
import mem from "mem";

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
        private clientId: string,
        private logger: Logger
    ) {}

    async getIdpUserFromAuthToken(authToken: string): Promise<IIdpUser | null> {
        try {
            await this.configureStrategy();
            const jwt = JWT.verify(authToken, this.keyStore, {
                issuer: this.openidConfiguration.issuer,
                audience: this.clientId,
            }) as { sub: string; iss: string };
            return { idp: jwt.iss, id: jwt.sub };
        } catch {
            // When errors occur, we simply return a null idp user
            return null;
        }
    }

    private configureStrategy = mem(
        async () => {
            try {
                await this.fetchOpenidConfiguration();
                await this.fetchJwks();
            } catch (err) {
                this.logger.error(
                    err,
                    "Error configuring OidcAuthenticationStrategy"
                );
            }
        },
        { maxAge: 5 * 60 * 1000 }
    );
    private async fetchOpenidConfiguration(): Promise<void> {
        const { data } = await axios.get<IOpenidConfiguration>(
            this.openidConfigurationUrl
        );
        this.openidConfiguration = data;
    }
    private async fetchJwks(): Promise<void> {
        const { data } = await axios.get<JSONWebKeySet>(
            this.openidConfiguration!.jwks_uri
        );
        this.keyStore = JWKS.asKeyStore(data);
    }
}
