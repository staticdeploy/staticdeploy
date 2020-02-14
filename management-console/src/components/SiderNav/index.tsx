import Icon from "antd/lib/icon";
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
                        <Icon type="global" />
                        <span>{"Apps and entrypoints"}</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="/bundles">
                    <Link to="/bundles">
                        <Icon type="folder" />
                        <span>{"Bundles"}</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="/externalCaches">
                    <Link to="/externalCaches">
                        <Icon type="cloud-server" />
                        <span>{"External caches"}</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="/users">
                    <Link to="/users">
                        <Icon type="user" />
                        <span>{"Users"}</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="/groups">
                    <Link to="/groups">
                        <Icon type="team" />
                        <span>{"Groups"}</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="/operationLogs">
                    <Link to="/operationLogs">
                        <Icon type="profile" />
                        <span>{"Operation logs"}</span>
                    </Link>
                </Menu.Item>
            </Menu>
        );
    }
}
export default withRouter(SiderNav);
