import { IAuthenticationStrategy } from "@staticdeploy/core";
import JwtAuthenticationStrategy from "@staticdeploy/jwt-authentication-strategy";
import OidcAuthenticationStrategy from "@staticdeploy/oidc-authentication-strategy";
import Logger from "bunyan";

import IConfig from "../common/IConfig";

export default (config: IConfig, logger: Logger): IAuthenticationStrategy[] => {
    const authenticationStrategies: IAuthenticationStrategy[] = [];

    if (config.jwtSecretOrPublicKey) {
        logger.info("Using JwtAuthenticationStrategy authentication strategy");
        authenticationStrategies.push(
            new JwtAuthenticationStrategy(config.jwtSecretOrPublicKey)
        );
    }

    if (config.oidcConfigurationUrl && config.oidcClientId) {
        logger.info("Using OidcAuthenticationStrategy authentication strategy");
        authenticationStrategies.push(
            new OidcAuthenticationStrategy(
                config.oidcConfigurationUrl,
                config.oidcClientId,
                logger
            )
        );
    }

    return authenticationStrategies;
};
