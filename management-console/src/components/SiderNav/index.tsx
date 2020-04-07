import FolderOutlined from "@ant-design/icons/FolderOutlined";
import GlobalOutlined from "@ant-design/icons/GlobalOutlined";
import ProfileOutlined from "@ant-design/icons/ProfileOutlined";
import TeamOutlined from "@ant-design/icons/TeamOutlined";
import UserOutlined from "@ant-design/icons/UserOutlined";
import Menu from "antd/lib/menu";
import * as React from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";

class SiderNav extends React.Component<RouteComponentProps> {
    render() {
        const firstLevelPath = this.props.location.pathname
            .split("/")
            .slice(0, 2)
            .join("/");
        return (
            <Menu
                className="c-SiderNav"
                theme="dark"
                selectedKeys={[firstLevelPath]}
            >
                <Menu.Item key="/apps">
                    <Link to="/apps">
                        <GlobalOutlined />
                        <span>{"Apps and entrypoints"}</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="/bundles">
                    <Link to="/bundles">
                        <FolderOutlined />
                        <span>{"Bundles"}</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="/users">
                    <Link to="/users">
                        <UserOutlined />
                        <span>{"Users"}</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="/groups">
                    <Link to="/groups">
                        <TeamOutlined />
                        <span>{"Groups"}</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="/operationLogs">
                    <Link to="/operationLogs">
                        <ProfileOutlined />
                        <span>{"Operation logs"}</span>
                    </Link>
                </Menu.Item>
            </Menu>
        );
    }
}
export default withRouter(SiderNav);
