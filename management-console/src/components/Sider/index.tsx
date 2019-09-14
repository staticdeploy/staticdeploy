import Layout from "antd/lib/layout";
import classnames from "classnames";
import React from "react";

import AuthService from "../../common/AuthService";
import Logo from "../Logo";
import LogoutButton from "../LogoutButton";
import SiderNav from "../SiderNav";
import "./index.css";

interface IProps {
    className?: string;
    authService: AuthService;
}
export default class Sider extends React.Component<IProps> {
    render() {
        return (
            <Layout.Sider
                className={classnames("c-Sider", this.props.className)}
                collapsible={true}
                collapsed={true}
                collapsedWidth={64}
                trigger={null}
            >
                <div className="c-Sider-logo-container">
                    <Logo withShadow={false} />
                </div>
                <SiderNav />
                <div className="c-Sider-logout-button-container">
                    <LogoutButton authService={this.props.authService} />
                </div>
            </Layout.Sider>
        );
    }
}
