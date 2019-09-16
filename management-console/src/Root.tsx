import Layout from "antd/lib/layout";
import React from "react";
import { Redirect, Route } from "react-router-dom";

import AuthService from "./common/AuthService";
import LoginMask from "./components/LoginMask";
import Sider from "./components/Sider";
import Apps from "./pages/Apps";
import Bundles from "./pages/Bundles";
import Groups from "./pages/Groups";
import OperationLogs from "./pages/OperationLogs";
import Users from "./pages/Users";
import "./Root.css";

interface IProps {
    authService: AuthService;
}
export default class Root extends React.Component<IProps> {
    render() {
        return (
            <LoginMask authService={this.props.authService}>
                <Layout className="c-Root">
                    <Sider
                        className="c-Root-sider"
                        authService={this.props.authService}
                    />
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
