import compact from "lodash/compact";

import * as config from "../../config";
import AuthService from "./AuthService";
import JwtAuthStrategy from "./JwtAuthStrategy";
import OidcAuthStrategy from "./OidcAuthStrategy";

export default new AuthService(
    config.AUTH_ENFORCED,
    compact([
        config.JWT_ENABLED ? new JwtAuthStrategy() : null,
        config.OIDC_ENABLED
            ? new OidcAuthStrategy(
                  config.OIDC_CONFIGURATION_URL,
                  config.OIDC_CLIENT_ID,
                  config.OIDC_REDIRECT_URL
              )
            : null
    ])
);
