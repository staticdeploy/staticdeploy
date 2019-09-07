import Layout from "antd/lib/layout";
import React from "react";
import { Redirect, Route } from "react-router-dom";

import authService from "./common/authService";
import LoginMask from "./components/LoginMask";
import Logo from "./components/Logo";
import LogoutButton from "./components/LogoutButton";
import SiderNav from "./components/SiderNav";
import { OIDC_PROVIDER_NAME } from "./config";
import Apps from "./pages/Apps";
import Bundles from "./pages/Bundles";
import Groups from "./pages/Groups";
import OperationLogs from "./pages/OperationLogs";
import Users from "./pages/Users";
import "./Root.css";

export default class Root extends React.Component {
    render() {
        return (
            <LoginMask
                authService={authService}
                oidcProviderName={OIDC_PROVIDER_NAME}
            >
                <Layout className="c-Root">
                    <Layout.Sider
                        className="c-Root-sider"
                        collapsible={true}
                        collapsed={true}
                        collapsedWidth={64}
                        trigger={null}
                    >
                        <div className="c-Root-logo-container">
                            <Logo withShadow={false} />
                        </div>
                        <SiderNav />
                        <div className="c-Root-logout-button-container">
                            <LogoutButton authService={authService} />
                        </div>
                    </Layout.Sider>
                    <Layout.Content className="c-Root-content">
                        <Route
                            path="/"
                            exact={true}
                            render={() => <Redirect to="/apps" />}
                        />
                        <Route path="/apps" component={Apps} />
                        <Route path="/bundles" component={Bundles} />
                        <Route path="/groups" component={Groups} />
                        <Route
                            path="/operationLogs"
                            component={OperationLogs}
                        />
                        <Route path="/users" component={Users} />
                    </Layout.Content>
                </Layout>
            </LoginMask>
        );
    }
}
