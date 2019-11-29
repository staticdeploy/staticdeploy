import StaticdeployClient from "@staticdeploy/sdk";
import ConfigProvider from "antd/lib/config-provider";
import enUS from "antd/lib/locale-provider/en_US";
import compact from "lodash/compact";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import "./antdStyles";
import AuthService from "./common/AuthService";
import JwtAuthStrategy from "./common/AuthService/JwtAuthStrategy";
import OidcAuthStrategy from "./common/AuthService/OidcAuthStrategy";
import StaticdeployClientContext from "./common/StaticdeployClientContext";
import InitSpinner from "./components/InitSpinner";
import config from "./config";
import "./index.css";
import reduxStore from "./reduxStore";
import Root from "./Root";

async function start() {
    const staticdeployClient = new StaticdeployClient({
        apiUrl: config.apiUrl
    });

    const authService = new AuthService(
        config.authEnforced,
        compact([
            config.jwtEnabled ? new JwtAuthStrategy() : null,
            config.oidcEnabled
                ? new OidcAuthStrategy(
                      config.oidcConfigurationUrl,
                      config.oidcClientId,
                      config.oidcRedirectUrl,
                      config.oidcProviderName
                  )
                : null
        ]),
        staticdeployClient
    );

    const root = document.getElementById("root");

    // Render a spinner while the authService is initializing
    ReactDOM.render(<InitSpinner />, root);

    await authService.init();

    if (OidcAuthStrategy.isSilentRedirectPage()) {
        // In the silent redirect iframe we only care about initializing the
        // authService, which will take care of concluding the silent redirect
        // process
        return;
    }

    // Render the app once the authService is initialized
    ReactDOM.render(
        <StaticdeployClientContext.Provider value={staticdeployClient}>
            <ConfigProvider locale={enUS}>
                <BrowserRouter>
                    <Provider store={reduxStore}>
                        <Root authService={authService} />
                    </Provider>
                </BrowserRouter>
            </ConfigProvider>
        </StaticdeployClientContext.Provider>,
        root
    );
}
start();
