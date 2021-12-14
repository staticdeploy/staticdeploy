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
                <Menu.Item key="/apps" icon={<GlobalOutlined />}>
                    <Link to="/apps">{"Apps and entrypoints"}</Link>
                </Menu.Item>
                <Menu.Item key="/bundles" icon={<FolderOutlined />}>
                    <Link to="/bundles">{"Bundles"}</Link>
                </Menu.Item>
                <Menu.Item key="/users" icon={<UserOutlined />}>
                    <Link to="/users">{"Users"}</Link>
                </Menu.Item>
                <Menu.Item key="/groups" icon={<TeamOutlined />}>
                    <Link to="/groups">{"Groups"}</Link>
                </Menu.Item>
                <Menu.Item key="/operationLogs" icon={<ProfileOutlined />}>
                    <Link to="/operationLogs">{"Operation logs"}</Link>
                </Menu.Item>
            </Menu>
        );
    }
}
export default withRouter(SiderNav);
