import ConfigProvider from "antd/lib/config-provider";
import enUS from "antd/lib/locale-provider/en_US";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import "./antdStyles";
import "./index.css";
import reduxStore from "./reduxStore";
import Root from "./Root";

const App = (
    <ConfigProvider locale={enUS}>
        <BrowserRouter>
            <Provider store={reduxStore}>
                <Root />
            </Provider>
        </BrowserRouter>
    </ConfigProvider>
);

ReactDOM.render(App, document.getElementById("root"));
