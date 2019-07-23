import LocaleProvider from "antd/lib/locale-provider";
import enUS from "antd/lib/locale-provider/en_US";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import reduxStore from "./reduxStore";
import Root from "./Root";

const App = (
    <LocaleProvider locale={enUS}>
        <BrowserRouter>
            <Provider store={reduxStore}>
                <Root />
            </Provider>
        </BrowserRouter>
    </LocaleProvider>
);

ReactDOM.render(App, document.getElementById("root"));
