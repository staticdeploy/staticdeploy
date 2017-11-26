import Icon from "antd/lib/icon";
import Layout from "antd/lib/layout";
import Menu from "antd/lib/menu";
import * as React from "react";
import { Link, Route, Switch } from "react-router-dom";

import Logo from "./components/Logo";
import Home from "./pages/Home";
import "./root.css";

export default class Root extends React.Component {
    renderRoutes() {
        return (
            <Switch>
                <Route component={Home} exact={true} path="/" />
            </Switch>
        );
    }
    render() {
        return (
            <Layout className="c-Root">
                <Layout.Sider
                    className="sider"
                    collapsible={true}
                    collapsed={true}
                    trigger={null}
                >
                    <div className="logo-container">
                        <Logo className="logo" />
                    </div>
                    <Menu
                        theme="dark"
                        selectedKeys={[window.location.pathname]}
                    >
                        <Menu.Item key="/">
                            <Link to="/">
                                <Icon type="home" />
                                <span>{"Home"}</span>
                            </Link>
                        </Menu.Item>
                    </Menu>
                </Layout.Sider>
                <Layout.Content className="content">
                    {this.renderRoutes()}
                </Layout.Content>
            </Layout>
        );
    }
}
